import { Market, Order, OrderStatus, Position } from '../../interfaces/subgraphTypes';
import { Decimal } from 'decimal.js';
import {
  DECIMAL_10,
  DECIMAL_ZERO,
  DEVIATION_PRECISION_MULTIPLIER,
  GAS_LIMIT_LIQUIDATION,
  GAS_LIMIT_SETTLEMENT,
  MAX_FEE,
  PRECISION_MULTIPLIER,
} from '../../common/constants';
import { getAccruedBorrowFeesInMarket, getMarketUtilization } from '../data-fabric';
import { convertCollateralAmountToUsd, convertMarketAmountToCollateral, convertMarketAmountToUsd } from '../price-feed';
import { Chain } from '@parifi/references';
import { contracts as parifiContracts } from '@parifi/references';
import { Contract, ethers } from 'ethers';
import { AxiosInstance } from 'axios';
import {
  getOrderById,
  getPythPriceIdsForOrderIds,
  getPythPriceIdsForPositionIds,
  getTotalUnrealizedPnlInUsd,
} from '../../subgraph';
import { getLatestPricesFromPyth, getVaaPriceUpdateData, normalizePythPriceForParifi } from '../../pyth/pyth';
import { getCurrentTimestampInSeconds, getPriceIdsForCollaterals } from '../../common';
import { executeTxUsingGelato } from '../../relayers/gelato/gelato-function';
import { InvalidValueError } from '../../error/invalid-value.error';
import { AbiCoder } from 'ethers';

// Returns an Order Manager contract instance without signer
export const getOrderManagerInstance = (chain: Chain): Contract => {
  try {
    return new ethers.Contract(parifiContracts[chain].OrderManager.address, parifiContracts[chain].OrderManager.abi);
  } catch (error) {
    throw error;
  }
};

// Return the Profit or Loss for a position in USD
// `normalizedMarketPrice` is the price of market with 8 decimals
export const getProfitOrLossInUsd = (
  userPosition: Position,
  normalizedMarketPrice: Decimal,
  marketDecimals: Decimal,
): { totalProfitOrLoss: Decimal; isProfit: boolean } => {
  let profitOrLoss: Decimal;
  let isProfit: boolean;

  if (!userPosition.avgPrice || !userPosition.positionSize) {
    throw new InvalidValueError('AvgPrice/PositionSize');
  }

  const positionAvgPrice = new Decimal(userPosition.avgPrice);

  if (userPosition.isLong) {
    if (normalizedMarketPrice.gt(positionAvgPrice)) {
      // User position is profitable
      profitOrLoss = normalizedMarketPrice.minus(positionAvgPrice);
      isProfit = true;
    } else {
      // User position is at loss
      profitOrLoss = positionAvgPrice.minus(normalizedMarketPrice);
      isProfit = false;
    }
  } else {
    if (normalizedMarketPrice.gt(positionAvgPrice)) {
      // User position is at loss
      profitOrLoss = normalizedMarketPrice.minus(positionAvgPrice);
      isProfit = false;
    } else {
      // User position is profitable
      profitOrLoss = positionAvgPrice.minus(normalizedMarketPrice);
      isProfit = true;
    }
  }
  const totalProfitOrLoss = new Decimal(userPosition.positionSize)
    .times(profitOrLoss)
    .dividedBy(DECIMAL_10.pow(marketDecimals));

  return { totalProfitOrLoss, isProfit };
};

// Returns the Profit or Loss of a position in collateral with decimals
// Normalized price for market and token is the price with 8 decimals, which is used
// throughout the protocol
export const getPnlWithoutFeesInCollateral = (
  position: Position,
  market: Market,
  normalizedMarketPrice: Decimal,
  normalizedCollateralPrice: Decimal,
): { profitOrLoss: Decimal; isProfit: boolean } => {
  if (!market?.depositToken?.decimals || !market?.marketDecimals) {
    throw new InvalidValueError('decimals');
  }
  const depositTokenDecimals = new Decimal(market?.depositToken?.decimals);
  const marketDecimals = new Decimal(market?.marketDecimals);

  const { totalProfitOrLoss: pnlInUsd, isProfit } = getProfitOrLossInUsd(
    position,
    normalizedMarketPrice,
    marketDecimals,
  );

  const tokenMultiplier = new Decimal(10).pow(depositTokenDecimals);
  const profitOrLoss = pnlInUsd.times(tokenMultiplier).dividedBy(normalizedCollateralPrice).ceil();

  return { profitOrLoss, isProfit };
};

// Returns the deviated price of the market based on the liquidity curve
// normalizedMarketPrice is the price of market in USD with 8 decimals
export const getDeviatedMarketPriceInUsd = (
  market: Market,
  normalizedMarketPrice: Decimal,
  isLong: boolean,
  isIncrease: boolean,
): Decimal => {
  if (!market.deviationCoeff || !market.deviationConst) {
    throw new InvalidValueError('deviationCoeff/deviationConst');
  }
  const marketUtilization = getMarketUtilization(market, isLong);

  const deviationPoints = new Decimal(market.deviationCoeff)
    .times(marketUtilization)
    .times(marketUtilization)
    .add(market.deviationConst);

  const PRECISION = DEVIATION_PRECISION_MULTIPLIER.mul(100);

  const increasedPrice = normalizedMarketPrice.times(PRECISION.add(deviationPoints)).dividedBy(PRECISION).ceil();
  const reducedPrice = normalizedMarketPrice.times(PRECISION.minus(deviationPoints)).dividedBy(PRECISION).floor();

  if (isIncrease) return isLong ? increasedPrice : reducedPrice;
  return isLong ? reducedPrice : increasedPrice;
};

// Returns `true` if a position can be liquidated, otherwise false
export const isPositionLiquidatable = (
  position: Position,
  market: Market,
  normalizedMarketPrice: Decimal,
  normalizedCollateralPrice: Decimal,
): { canBeLiquidated: boolean } => {
  if (
    !market?.depositToken?.decimals ||
    !market?.marketDecimals ||
    !market.closingFee ||
    !market.liquidationFee ||
    !market.liquidationThreshold
  ) {
    throw new InvalidValueError('decimals/fee/liquidationThreshold');
  }

  if (!position.positionCollateral || !position.positionSize) {
    throw new InvalidValueError('Position size/collateral');
  }

  let canBeLiquidated: boolean = false;

  const { profitOrLoss: pnlInCollateral, isProfit } = getPnlWithoutFeesInCollateral(
    position,
    market,
    normalizedMarketPrice,
    normalizedCollateralPrice,
  );

  // The fixed fees during liquidation include the closing fee and the liquidation fee
  const fixedClosingFeeDuringLiquidation = new Decimal(market.liquidationFee)
    .add(market.closingFee)
    .mul(position.positionSize)
    .dividedBy(MAX_FEE);

  const accruedBorrowFeesInMarket = getAccruedBorrowFeesInMarket(position, market);

  const totalFeesMarket = fixedClosingFeeDuringLiquidation.add(accruedBorrowFeesInMarket);
  const feesInCollateral = convertMarketAmountToCollateral(
    totalFeesMarket,
    new Decimal(market.marketDecimals),
    new Decimal(market.depositToken?.decimals),
    normalizedMarketPrice,
    normalizedCollateralPrice,
  );

  let lossInCollateral: Decimal;
  if (isProfit) {
    // If the position is profitable and fees are less than the profit, return false
    // else calculate the loss by subtracting profit from fees
    if (feesInCollateral.lessThan(pnlInCollateral)) {
      return { canBeLiquidated: false };
    } else {
      lossInCollateral = feesInCollateral.minus(pnlInCollateral);
    }
  } else {
    // Add fees to position loss to get net loss
    lossInCollateral = pnlInCollateral.add(feesInCollateral);
  }

  const liquidationThresholdInCollateral = new Decimal(market.liquidationThreshold)
    .times(position.positionCollateral)
    .dividedBy(PRECISION_MULTIPLIER);

  if (lossInCollateral.gt(liquidationThresholdInCollateral)) canBeLiquidated = true;

  return {
    canBeLiquidated,
  };
};

export const calculatePositionLeverage = (
  position: Position,
  market: Market,
  normalizedMarketPrice: Decimal,
  normalizedCollateralPrice: Decimal,
): {
  leverage: string;
  formattedLeverage: number;
} => {
  if (!market?.depositToken?.decimals || !market?.marketDecimals) {
    throw new InvalidValueError('decimals/fee');
  }
  if (!position.positionCollateral || !position.positionSize) {
    throw new InvalidValueError('Position size/collateral');
  }

  let leverage: Decimal = new Decimal('0');

  const positionCollateralAmount = new Decimal(position.positionCollateral);

  // Convert the position size in collateral terms
  const sizeInCollateral = convertMarketAmountToCollateral(
    new Decimal(position.positionSize),
    new Decimal(market.marketDecimals),
    new Decimal(market.depositToken?.decimals),
    normalizedMarketPrice,
    normalizedCollateralPrice,
  );

  const { netPnlInCollateral, isNetProfit } = getNetProfitOrLossInCollateral(
    position,
    market,
    normalizedMarketPrice,
    normalizedCollateralPrice,
  );

  const sizeInCollateralWithPrecision = sizeInCollateral.mul(PRECISION_MULTIPLIER);

  if (isNetProfit) {
    leverage = sizeInCollateralWithPrecision.div(positionCollateralAmount.add(netPnlInCollateral)).ceil();
  } else {
    // Handle divide by zero in case loss is not recoverable from collateral
    if (netPnlInCollateral.lt(positionCollateralAmount)) {
      leverage = sizeInCollateralWithPrecision.dividedBy(positionCollateralAmount.minus(netPnlInCollateral)).ceil();
    } else {
      leverage = new Decimal(10000);
    }
  }

  return {
    leverage: leverage.toString(),
    formattedLeverage: leverage.dividedBy(PRECISION_MULTIPLIER).toNumber(),
  };
};

// Returns the net profit or loss considering the accrued borrowing fees for the position
export const getNetProfitOrLossInCollateral = (
  position: Position,
  market: Market,
  normalizedMarketPrice: Decimal,
  normalizedCollateralPrice: Decimal,
): { netPnlInCollateral: Decimal; isNetProfit: boolean } => {
  if (!market?.depositToken?.decimals || !market?.marketDecimals) {
    throw new InvalidValueError('decimals');
  }

  // Get profit/loss for the position without fees
  const { profitOrLoss: pnlInCollateral, isProfit } = getPnlWithoutFeesInCollateral(
    position,
    market,
    normalizedMarketPrice,
    normalizedCollateralPrice,
  );

  // Calculate the fees accrued for this position
  const accruedBorrowFeesInMarket = getAccruedBorrowFeesInMarket(position, market);

  const feesInCollateral = convertMarketAmountToCollateral(
    accruedBorrowFeesInMarket,
    new Decimal(market.marketDecimals),
    new Decimal(market.depositToken?.decimals),
    normalizedMarketPrice,
    normalizedCollateralPrice,
  );

  let netPnlInCollateral: Decimal;
  let isNetProfit: boolean;
  if (isProfit) {
    // If the position is profitable and fees are less than the profit, return false
    // else calculate the loss by subtracting profit from fees
    if (feesInCollateral.lessThan(pnlInCollateral)) {
      netPnlInCollateral = pnlInCollateral.minus(feesInCollateral);
      isNetProfit = true;
    } else {
      // Fees are more than the profit
      netPnlInCollateral = feesInCollateral.minus(pnlInCollateral);
      isNetProfit = false;
    }
  } else {
    // Add fees to position loss to get net loss
    netPnlInCollateral = pnlInCollateral.add(feesInCollateral);
    isNetProfit = false;
  }

  return { netPnlInCollateral, isNetProfit };
};

// Returns true if the price of market is within the range configured in order struct
// The function can be used to check if a pending order can be settled or not
// Uses the same code implementation from Smart contract
export const canBeSettled = (
  isLimitOrder: boolean,
  triggerAbove: boolean,
  isLong: boolean,
  maxSlippage: Decimal,
  expectedPrice: Decimal,
  normalizedMarketPrice: Decimal,
): boolean => {
  if (isLimitOrder) {
    // For limit orders, expected price cannot be zero
    if (expectedPrice.equals(DECIMAL_ZERO)) return false;

    // If its a limit order, check if the limit price is reached, either above or below
    // depending on the triggerAbove flag
    if (
      (triggerAbove && normalizedMarketPrice.lessThan(expectedPrice)) ||
      (!triggerAbove && normalizedMarketPrice.greaterThan(expectedPrice))
    ) {
      console.log('Order cannot be settled because of Trigger price');
      return false;
    }
  } else {
    // Market Orders
    // Check if current market price is within slippage range
    if (!expectedPrice.equals(DECIMAL_ZERO)) {
      const upperLimit = expectedPrice.mul(PRECISION_MULTIPLIER.add(maxSlippage)).div(PRECISION_MULTIPLIER);
      const lowerLimit = expectedPrice.mul(PRECISION_MULTIPLIER.sub(maxSlippage)).div(PRECISION_MULTIPLIER);

      if ((isLong && normalizedMarketPrice > upperLimit) || (!isLong && normalizedMarketPrice < lowerLimit)) {
        console.log('Order cannot be settled because of slippage price limits');
        return false;
      }
    }
  }
  return true;
};

// Returns true if the price of market is within the range configured in order struct
// The function can be used to check if a pending order can be settled or not
export const canBeSettledPriceId = async (
  isLimitOrder: boolean,
  triggerAbove: boolean,
  isLong: boolean,
  maxSlippage: Decimal,
  expectedPrice: Decimal,
  orderPriceId: string,
  pythClient: AxiosInstance,
): Promise<boolean> => {
  // Pyth returns price id without '0x' at the start, hence the price id from order
  // needs to be formatted
  const formattedPriceId = orderPriceId.startsWith('0x') ? orderPriceId.substring(2) : orderPriceId;

  const pythLatestPrices = await getLatestPricesFromPyth([orderPriceId], pythClient);

  const assetPrice = pythLatestPrices.find((pythPrice) => pythPrice.id === formattedPriceId);

  if (!assetPrice?.price.price || !assetPrice?.price.expo) {
    throw new InvalidValueError('assetPrice/expo');
  }

  const normalizedMarketPrice = normalizePythPriceForParifi(parseInt(assetPrice?.price.price), assetPrice?.price.expo);

  return canBeSettled(isLimitOrder, triggerAbove, isLong, maxSlippage, expectedPrice, normalizedMarketPrice);
};

// Returns true if the price of market is within the range configured in order struct
// The function can be used to check if a pending order can be settled or not
export const checkIfOrderCanBeSettled = (order: Order, normalizedMarketPrice: Decimal): boolean => {
  // Return false if any of the fields is undefined
  if (order.isLimitOrder === undefined || order.triggerAbove === undefined || order.isLong === undefined) {
    console.log('Fields in Order struct undefined. Order cannot be settled');
    return false;
  }

  // Return false if any of the fields is undefined
  if (order.expectedPrice === undefined || order.maxSlippage === undefined) {
    console.log('Fields in Order struct undefined. Order cannot be settled');
    return false;
  }

  if (order.status !== OrderStatus.PENDING) {
    console.log('Order already settled or cancelled');
    return false;
  }

  const orderDeadline = Number(order.deadline);
  if (orderDeadline < getCurrentTimestampInSeconds() && orderDeadline != 0) {
    console.log('Order expired, cannot be settled');
    return false;
  }

  return canBeSettled(
    order.isLimitOrder,
    order.triggerAbove,
    order.isLong,
    new Decimal(order.maxSlippage),
    new Decimal(order.expectedPrice),
    normalizedMarketPrice,
  );
};

// Returns true if the price of market is within the range configured in order struct
// The function can be used to check if a pending order can be settled or not
export const checkIfOrderCanBeSettledId = async (
  subgraphEndpoint: string,
  orderId: string,
  pythClient: AxiosInstance,
): Promise<boolean> => {
  const order = await getOrderById(subgraphEndpoint, orderId);

  // Pyth returns price id without '0x' at the start, hence the price id from order
  // needs to be formatted
  const orderPriceId = order.market?.pyth?.id ?? '0x';
  const formattedPriceId = orderPriceId.startsWith('0x') ? orderPriceId.substring(2) : orderPriceId;

  const pythLatestPrices = await getLatestPricesFromPyth([orderPriceId], pythClient);

  const assetPrice = pythLatestPrices.find((pythPrice) => pythPrice.id === formattedPriceId);

  if (!assetPrice?.price.price || !assetPrice?.price.expo) {
    throw new InvalidValueError('assetPrice/expo');
  }
  const normalizedMarketPrice = normalizePythPriceForParifi(parseInt(assetPrice?.price.price), assetPrice?.price.expo);

  return checkIfOrderCanBeSettled(order, normalizedMarketPrice);
};

// Liquidates a position using Gelato as the relayer
export const liquidatePositionUsingGelato = async (
  chainId: Chain,
  positionId: string,
  gelatoKey: string,
  subgraphEndpoint: string,
  isStablePyth: boolean,
  pythClient: AxiosInstance,
): Promise<{ gelatoTaskId: string }> => {
  // Get unique price ids for the position
  const priceIds = await getPythPriceIdsForPositionIds(subgraphEndpoint, [positionId]);
  const collateralPriceIds = getPriceIdsForCollaterals(isStablePyth);

  // Get Price update data and latest prices from Pyth
  const priceUpdateData = await getVaaPriceUpdateData(priceIds.concat(collateralPriceIds), pythClient);

  // Encode transaction data
  let taskId: string = '';
  const orderManager = getOrderManagerInstance(chainId);
  const { data: encodedTxData } = await orderManager.liquidatePosition.populateTransaction(positionId, priceUpdateData);

  const gelatoGasLimit = BigInt(GAS_LIMIT_LIQUIDATION);
  taskId = await executeTxUsingGelato(
    parifiContracts[chainId].OrderManager.address,
    chainId,
    gelatoKey,
    encodedTxData,
    gelatoGasLimit,
  );

  // We need these console logs for feedback to Tenderly actions and other scripts
  console.log('Task ID:', taskId);
  return { gelatoTaskId: taskId };
};

// Settles an order using Gelato as the relayer
export const settleOrderUsingGelato = async (
  chainId: Chain,
  orderId: string,
  gelatoKey: string,
  subgraphEndpoint: string,
  isStablePyth: boolean,
  pythClient: AxiosInstance,
): Promise<{ gelatoTaskId: string }> => {
  // Get unique price ids for the order
  const priceIds = await getPythPriceIdsForOrderIds(subgraphEndpoint, [orderId]);
  const collateralPriceIds = getPriceIdsForCollaterals(isStablePyth);

  // Get Price update data and latest prices from Pyth
  const priceUpdateData = await getVaaPriceUpdateData(priceIds.concat(collateralPriceIds), pythClient);

  // Encode transaction data
  let taskId: string = '';
  const orderManager = getOrderManagerInstance(chainId);
  const { data: encodedTxData } = await orderManager.settleOrder.populateTransaction(orderId, priceUpdateData);

  const gelatoGasLimit = BigInt(GAS_LIMIT_SETTLEMENT);

  taskId = await executeTxUsingGelato(
    parifiContracts[chainId].OrderManager.address,
    chainId,
    gelatoKey,
    encodedTxData,
    gelatoGasLimit,
  );

  // We need these console logs for feedback to Tenderly actions and other scripts
  console.log('Task ID:', taskId);
  return { gelatoTaskId: taskId };
};

// Returns the liquidation price of a Position
// A position is liquidated when the loss of a position in USD goes above the USD value
// of liquidation threshold times the deposited collateral value
export const getLiquidationPrice = (
  position: Position,
  market: Market,
  normalizedMarketPrice: Decimal,
  normalizedCollateralPrice: Decimal,
): Decimal => {
  if (
    !market?.depositToken?.decimals ||
    !market?.marketDecimals ||
    !market.openingFee ||
    !market.liquidationFee ||
    !market.liquidationThreshold
  ) {
    throw new InvalidValueError('decimals/fee/liquidationThreshold');
  }
  if (!position.positionCollateral || !position.positionSize || !position.avgPrice) {
    throw new InvalidValueError('Position size/collateral/avgPrice');
  }

  const collateral = new Decimal(position.positionCollateral);

  // Decimal digits for market and collateral token
  const collateralDecimals = new Decimal(market.depositToken?.decimals);
  const marketDecimals = new Decimal(market.marketDecimals);

  // Total fees for the position taking into account closing fee and liquidation fee
  const accruedBorrowFeesInMarket = getAccruedBorrowFeesInMarket(position, market);
  const fixedFeesInMarket = new Decimal(position.positionSize)
    .times(new Decimal(market.openingFee).add(market.liquidationFee))
    .div(MAX_FEE);

  const totalFeesInUsd = convertMarketAmountToUsd(
    accruedBorrowFeesInMarket.add(fixedFeesInMarket),
    marketDecimals,
    normalizedMarketPrice,
  );

  const collateralInUsd = convertCollateralAmountToUsd(collateral, collateralDecimals, normalizedCollateralPrice);
  const maxLossLimitInUsd = collateralInUsd.times(market.liquidationThreshold).div(PRECISION_MULTIPLIER);

  let lossLimitAfterFees = maxLossLimitInUsd.sub(totalFeesInUsd);

  let { totalProfitOrLoss: totalProfitOrLossInUsd, isProfit } = getProfitOrLossInUsd(
    position,
    normalizedMarketPrice,
    marketDecimals,
  );

  // If the position is profitable, add the profits to increase the maxLoss limit, else skip losses
  // as its already factored in
  if (isProfit) {
    lossLimitAfterFees = lossLimitAfterFees.add(totalProfitOrLossInUsd);
  }

  // @todo Revisit this
  // If loss is already more than the max loss, the position can be liquidated at the current price
  if (lossLimitAfterFees.lessThan(DECIMAL_ZERO)) return normalizedMarketPrice;

  const lossPerToken = lossLimitAfterFees.times(DECIMAL_10.pow(marketDecimals)).div(position.positionSize);

  if (position.isLong) {
    return new Decimal(position.avgPrice).sub(lossPerToken);
  } else {
    return new Decimal(position.avgPrice).add(lossPerToken);
  }
};

/**
 * @name calculateCollateralFromSize
 * @description This function calculates the collateral required based on the given size, leverage and normalized market price and collateral price.
 * @param {number} collateralSize - The size of the collateral in eth unit.
 * @param {number} leverage - The degree of financial leverage being used.
 * @param {Decimal} normalizedMarketPrice - The normalized market price of the underlying asset.
 * @param {Decimal} normalizedCollateralPrice - The normalized price of the collateral.
 * @returns {Decimal} - The calculated collateral required to maintain the position.
 */

export const calculateCollateralFromSize = (
  collateralSize: Decimal,
  leverage: Decimal,
  normalizedMarketPrice: Decimal,
  normalizedCollateralPrice: Decimal,
) => {
  return normalizedMarketPrice.mul(collateralSize).div(normalizedCollateralPrice).div(leverage);
};

/**
 * @name calculateSizeFromCollateral
 * @description Calculates the position size in the base asset given the collateral amount, leverage, execution fee in collateral, opening fee, and normalised market price and collateral price.
 * @param {Decimal} amount - The collateral amount in eth units.
 * @param {Decimal} leverage - The total leverage used for this position.
 * @param {Decimal} executionFeeInCollateral - The execution fee on collateral units.
 * @param {Decimal} openingFee - The opening fee for the trade.
 * @param {Decimal} normalizedMarketPrice - The normalised price of the base asset in terms of the quote asset.
 * @param {Decimal} normalizedCollateralPrice - The normalised price of the collateral asset in terms of the quote asset.
 * @returns {Decimal} - The calculated position size in the base asset.
 */

export const calculateSizeFromCollateral = (
  amount: Decimal,
  leverage: Decimal,
  executionFeeInCollateral: Decimal,
  openingFee: Decimal,
  normalizedMarketPrice: Decimal,
  normalizedCollateralPrice: Decimal,
) => {
  const collateralInUsd = amount.mul(normalizedCollateralPrice);
  const executionFeeInUsd = executionFeeInCollateral.mul(normalizedCollateralPrice);

  const sizeInUsd = collateralInUsd.sub(executionFeeInUsd).div(openingFee.add(1).div(leverage));

  return sizeInUsd.div(normalizedMarketPrice);
};

/**
 * Computes a unique position ID for a given user, nonce, and chain ID.
 *
 * @param userAddress - The address of the user.
 * @param positionNonce - The nonce associated with the user's position.
 * @param chainId - The ID of the blockchain network.
 * @returns The computed position ID as a hex string.
 */

export const getExpectedPositionIdFromNonce = (userAddress: string, positionNonce: BigInt, chainId: number): string => {
  const AbiCoder = new ethers.AbiCoder();
  return ethers.keccak256(
    AbiCoder.encode(['string', 'address', 'uint256', 'uint256'], ['POS', userAddress, positionNonce, chainId]),
  );
};

/**
 * Fetches the position nonce for a given user from the order manager contract.
 *
 * @param userAddress - The address of the user.
 * @param chain - The chain object containing information about the blockchain network.
 * @returns A Promise that resolves to the position nonce as a BigInt, or null if an error occurs.
 */
export const getUserPositionNonce = async (userAddress: string, chain: Chain): Promise<BigInt | null> => {
  const orderManagerContract = getOrderManagerInstance(chain);

  try {
    const nonce = await orderManagerContract.positionNonce(userAddress);
    return nonce;
  } catch (error) {
    console.error('Error fetching position nonce:', error);
    return null;
  }
};

/**
 * Fetches the position ID for a given user from the order manager contract.
 *
 * @param userAddress - The address of the user.
 * @param chain - The chain object containing information about the blockchain network.
 * @returns A Promise that resolves to the position ID as a string, or null if an error occurs.
 */

export const getUserExpectedPositionId = async (userAddress: string, chain: Chain): Promise<string | null> => {
  const userPositionNonce = await getUserPositionNonce(userAddress, chain);
  if (userPositionNonce !== null) {
    return getExpectedPositionIdFromNonce(userAddress, userPositionNonce, chain); // Assuming chain has an id property
  }
  return null;
};
