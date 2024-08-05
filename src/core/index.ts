import Decimal from 'decimal.js';
import { PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from '../interfaces/classConfigs';
import { Market, Order, Position } from '../interfaces/subgraphTypes';
import {
  getAccruedBorrowFeesInMarket,
  getBaseBorrowRatePerSecond,
  getDynamicBorrowRatePerSecond,
  getMarketSkew,
  getMarketSkewUi,
  getMarketUtilization,
} from './data-fabric';
import { Contract, Signer } from 'ethers';
import {
  calculateCollateralFromSize,
  calculatePositionLeverage,
  calculateSizeFromCollateral,
  canBeSettled,
  canBeSettledPriceId,
  checkIfOrderCanBeSettledId,
  getLiquidationPrice,
  getNetProfitOrLossInCollateral,
  getOrderManagerInstance,
  getPositionId,
  getProfitOrLossInUsd,
  getUserPositionId,
  getUserPositionNonce,
  isPositionLiquidatable,
  liquidatePositionUsingGelato,
  settleOrderUsingGelato,
} from './order-manager';
import { checkIfOrderCanBeSettled } from './order-manager/';
import {
  batchLiquidatePostionsUsingGelato,
  batchSettleOrdersUsingGelato,
  batchSettleOrdersUsingWallet,
  batchSettlePendingOrdersUsingGelato,
  getBatchLiquidateTxData,
  getBatchSettleTxData,
  getParifiUtilsInstance,
} from './parifi-utils';
import { convertCollateralAmountToUsd, convertMarketAmountToCollateral, convertMarketAmountToUsd } from './price-feed';
import {
  getMarketBorrowingRatePerHour,
  getMarketOpenInterestInUsd,
  getTotalOpenInterestInUsd,
} from './pages/statsPage';
import { getPublicSubgraphEndpoint } from '../subgraph';
import { getPythClient } from '../pyth/pyth';
import { UserVaultData } from '../interfaces/sdkTypes';
import { getPoolPageData } from './pages/poolPage';
import { getPositionRefreshTxData } from './subgraph-helper';
import { Chain } from '@parifi/references';

export class Core {
  constructor(
    private rpcConfig: RpcConfig,
    private subgraphConfig: SubgraphConfig,
    private relayerConfig: RelayerConfig,
    private pythConfig: PythConfig,
  ) {}

  ////////////////////////////////////////////////////////////////
  //////////////////////    DATA FABRIC    ///////////////////////
  ////////////////////////////////////////////////////////////////

  getMarketUtilization = (market: Market, isLong: boolean): Decimal => {
    return getMarketUtilization(market, isLong);
  };

  getMarketSkew = (market: Market): Decimal => {
    return getMarketSkew(market);
  };

  getMarketSkewUi = (market: Market): { skewLongs: Decimal; skewShorts: Decimal } => {
    return getMarketSkewUi(market);
  };

  getDynamicBorrowRatePerSecond = (market: Market): Decimal => {
    return getDynamicBorrowRatePerSecond(market);
  };

  getBaseBorrowRatePerSecond = (
    market: Market,
  ): { baseBorrowRatePerSecondLong: Decimal; baseBorrowRatePerSecondShort: Decimal } => {
    return getBaseBorrowRatePerSecond(market);
  };

  getAccruedBorrowFeesInMarket = (position: Position, market: Market): Decimal => {
    return getAccruedBorrowFeesInMarket(position, market);
  };

  ////////////////////////////////////////////////////////////////
  //////////////////////    ORDER MANAGER    /////////////////////
  ////////////////////////////////////////////////////////////////

  calculateSizeFromCollateral(
    amount: Decimal,
    leverage: Decimal,
    executionFeeInCollateral: Decimal,
    openingFee: Decimal,
    normalizedMarketPrice: Decimal,
    normalizedCollateralPrice: Decimal,
  ) {
    return calculateSizeFromCollateral(
      amount,
      leverage,
      executionFeeInCollateral,
      openingFee,
      normalizedMarketPrice,
      normalizedCollateralPrice,
    );
  }
  calculateCollateralFromSize(
    collateralSize: Decimal,
    leverage: Decimal,
    normalizedMarketPrice: Decimal,
    normalizedCollateralPrice: Decimal,
  ): Decimal {
    return calculateCollateralFromSize(collateralSize, leverage, normalizedMarketPrice, normalizedCollateralPrice);
  }

  getOrderManagerInstance = (): Contract => {
    return getOrderManagerInstance(this.rpcConfig.chainId);
  };

  getProfitOrLossInUsd = (
    userPosition: Position,
    normalizedMarketPrice: Decimal,
    marketDecimals: Decimal,
  ): { totalProfitOrLoss: Decimal; isProfit: boolean } => {
    return getProfitOrLossInUsd(userPosition, normalizedMarketPrice, marketDecimals);
  };

  getPnlWithoutFeesInCollateral = (
    position: Position,
    market: Market,
    normalizedMarketPrice: Decimal,
    normalizedCollateralPrice: Decimal,
  ): { profitOrLoss: Decimal; isProfit: boolean } => {
    return this.getPnlWithoutFeesInCollateral(position, market, normalizedMarketPrice, normalizedCollateralPrice);
  };

  getDeviatedMarketPriceInUsd = (
    market: Market,
    normalizedMarketPrice: Decimal,
    isLong: boolean,
    isIncrease: boolean,
  ): Decimal => {
    return this.getDeviatedMarketPriceInUsd(market, normalizedMarketPrice, isLong, isIncrease);
  };

  isPositionLiquidatable = (
    position: Position,
    market: Market,
    normalizedMarketPrice: Decimal,
    normalizedCollateralPrice: Decimal,
  ): { canBeLiquidated: boolean } => {
    return isPositionLiquidatable(position, market, normalizedMarketPrice, normalizedCollateralPrice);
  };

  calculatePositionLeverage = (
    position: Position,
    market: Market,
    normalizedMarketPrice: Decimal,
    normalizedCollateralPrice: Decimal,
  ): {
    leverage: string;
    formattedLeverage: number;
  } => {
    return calculatePositionLeverage(position, market, normalizedMarketPrice, normalizedCollateralPrice);
  };

  getNetProfitOrLossInCollateral = (
    position: Position,
    market: Market,
    normalizedMarketPrice: Decimal,
    normalizedCollateralPrice: Decimal,
  ): { netPnlInCollateral: Decimal; isNetProfit: boolean } => {
    return getNetProfitOrLossInCollateral(position, market, normalizedMarketPrice, normalizedCollateralPrice);
  };

  canBeSettled = (
    isLimitOrder: boolean,
    triggerAbove: boolean,
    isLong: boolean,
    maxSlippage: Decimal,
    expectedPrice: Decimal,
    normalizedMarketPrice: Decimal,
  ): boolean => {
    return canBeSettled(isLimitOrder, triggerAbove, isLong, maxSlippage, expectedPrice, normalizedMarketPrice);
  };

  canBeSettledPriceId = async (
    isLimitOrder: boolean,
    triggerAbove: boolean,
    isLong: boolean,
    maxSlippage: Decimal,
    expectedPrice: Decimal,
    orderPriceId: string,
  ): Promise<boolean> => {
    const pythClient = await getPythClient(
      this.pythConfig.pythEndpoint,
      this.pythConfig.username,
      this.pythConfig.password,
      this.pythConfig.isStable,
    );

    return await canBeSettledPriceId(
      isLimitOrder,
      triggerAbove,
      isLong,
      maxSlippage,
      expectedPrice,
      orderPriceId,
      pythClient,
    );
  };

  checkIfOrderCanBeSettled = (order: Order, normalizedMarketPrice: Decimal): boolean => {
    return checkIfOrderCanBeSettled(order, normalizedMarketPrice);
  };

  checkIfOrderCanBeSettledId = async (orderId: string): Promise<boolean> => {
    const subgraphEndpoint = this.subgraphConfig.subgraphEndpoint ?? getPublicSubgraphEndpoint(this.rpcConfig.chainId);
    const pythClient = await getPythClient(
      this.pythConfig.pythEndpoint,
      this.pythConfig.username,
      this.pythConfig.password,
      this.pythConfig.isStable,
    );
    return await checkIfOrderCanBeSettledId(subgraphEndpoint, orderId, pythClient);
  };

  liquidatePositionUsingGelato = async (positionId: string): Promise<{ gelatoTaskId: string }> => {
    // Get all the variables from SDK config
    const gelatoApiKey = this.relayerConfig.gelatoConfig?.apiKey ?? '';
    const isStablePyth = this.pythConfig.isStable ?? true;

    const subgraphEndpoint = this.subgraphConfig.subgraphEndpoint ?? getPublicSubgraphEndpoint(this.rpcConfig.chainId);
    const pythClient = await getPythClient(
      this.pythConfig.pythEndpoint,
      this.pythConfig.username,
      this.pythConfig.password,
      this.pythConfig.isStable,
    );

    return liquidatePositionUsingGelato(
      this.rpcConfig.chainId,
      positionId,
      gelatoApiKey,
      subgraphEndpoint,
      isStablePyth,
      pythClient,
    );
  };

  settleOrderUsingGelato = async (orderId: string): Promise<{ gelatoTaskId: string }> => {
    // Get all the variables from SDK config
    const gelatoApiKey = this.relayerConfig.gelatoConfig?.apiKey ?? '';
    const isStablePyth = this.pythConfig.isStable ?? true;

    const subgraphEndpoint = this.subgraphConfig.subgraphEndpoint ?? getPublicSubgraphEndpoint(this.rpcConfig.chainId);
    const pythClient = await getPythClient(
      this.pythConfig.pythEndpoint,
      this.pythConfig.username,
      this.pythConfig.password,
      this.pythConfig.isStable,
    );

    return settleOrderUsingGelato(
      this.rpcConfig.chainId,
      orderId,
      gelatoApiKey,
      subgraphEndpoint,
      isStablePyth,
      pythClient,
    );
  };

  getLiquidationPrice = (
    position: Position,
    market: Market,
    normalizedMarketPrice: Decimal,
    normalizedCollateralPrice: Decimal,
  ): Decimal => {
    return getLiquidationPrice(position, market, normalizedMarketPrice, normalizedCollateralPrice);
  };

  ////////////////////////////////////////////////////////////////
  //////////////////////    PARIFI UTILS    //////////////////////
  ////////////////////////////////////////////////////////////////

  getParifiUtilsInstance = (): Contract => {
    return getParifiUtilsInstance(this.rpcConfig.chainId);
  };

  batchSettlePendingOrdersUsingGelato = async (): Promise<{ ordersCount: number; gelatoTaskId: string }> => {
    const subgraphEndpoint = this.subgraphConfig.subgraphEndpoint ?? getPublicSubgraphEndpoint(this.rpcConfig.chainId);
    const pythClient = await getPythClient(
      this.pythConfig.pythEndpoint,
      this.pythConfig.username,
      this.pythConfig.password,
      this.pythConfig.isStable,
    );
    const isStablePyth = this.pythConfig.isStable ?? true;
    const gelatoKey = this.relayerConfig.gelatoConfig?.apiKey ?? '';

    return batchSettlePendingOrdersUsingGelato(
      this.rpcConfig.chainId,
      gelatoKey,
      subgraphEndpoint,
      isStablePyth,
      pythClient,
    );
  };

  batchLiquidatePositionsUsingGelato = async (
    positionIds: string[],
  ): Promise<{ positionsCount: number; gelatoTaskId: string }> => {
    if (positionIds.length == 0) return { positionsCount: 0, gelatoTaskId: '' };

    const subgraphEndpoint = this.subgraphConfig.subgraphEndpoint ?? getPublicSubgraphEndpoint(this.rpcConfig.chainId);
    const pythClient = await getPythClient(
      this.pythConfig.pythEndpoint,
      this.pythConfig.username,
      this.pythConfig.password,
      this.pythConfig.isStable,
    );

    const isStablePyth = this.pythConfig.isStable ?? true;
    const gelatoKey = this.relayerConfig.gelatoConfig?.apiKey ?? '';

    return batchLiquidatePostionsUsingGelato(
      this.rpcConfig.chainId,
      positionIds,
      gelatoKey,
      subgraphEndpoint,
      isStablePyth,
      pythClient,
    );
  };

  batchSettleOrdersUsingGelato = async (
    orderIds: string[],
    priceUpdateData: string[],
  ): Promise<{ ordersCount: number; gelatoTaskId: string }> => {
    const gelatoKey = this.relayerConfig.gelatoConfig?.apiKey ?? '';
    return batchSettleOrdersUsingGelato(this.rpcConfig.chainId, orderIds, priceUpdateData, gelatoKey);
  };

  batchSettleOrdersUsingWallet = async (
    orderIds: string[],
    priceUpdateData: string[],
    wallet: Signer,
  ): Promise<{ txHash: string }> => {
    return await batchSettleOrdersUsingWallet(this.rpcConfig.chainId, orderIds, priceUpdateData, wallet);
  };

  // Returns encoded tx data to batch settle multiple orders
  getBatchSettleTxData = async (orderIds: string[]): Promise<{ txData: string }> => {
    const subgraphEndpoint = this.subgraphConfig.subgraphEndpoint ?? getPublicSubgraphEndpoint(this.rpcConfig.chainId);
    const pythClient = await getPythClient(
      this.pythConfig.pythEndpoint,
      this.pythConfig.username,
      this.pythConfig.password,
      this.pythConfig.isStable,
    );

    return await getBatchSettleTxData(this.rpcConfig.chainId, subgraphEndpoint, pythClient, orderIds);
  };

  // Returns encoded tx data to batch liquidate multiple positions
  getBatchLiquidateTxData = async (positionIds: string[]): Promise<{ txData: string }> => {
    const subgraphEndpoint = this.subgraphConfig.subgraphEndpoint ?? getPublicSubgraphEndpoint(this.rpcConfig.chainId);
    const pythClient = await getPythClient(
      this.pythConfig.pythEndpoint,
      this.pythConfig.username,
      this.pythConfig.password,
      this.pythConfig.isStable,
    );

    return await getBatchLiquidateTxData(this.rpcConfig.chainId, subgraphEndpoint, pythClient, positionIds);
  };

  ////////////////////////////////////////////////////////////////
  //////////////////////    PRICEFEED    /////////////////////////
  ////////////////////////////////////////////////////////////////
  convertMarketAmountToCollateral = (
    marketAmount: Decimal,
    marketDecimals: Decimal,
    collateralDecimals: Decimal,
    normalizedMarketPrice: Decimal,
    normalizedCollateralPrice: Decimal,
  ): Decimal => {
    return convertMarketAmountToCollateral(
      marketAmount,
      marketDecimals,
      collateralDecimals,
      normalizedMarketPrice,
      normalizedCollateralPrice,
    );
  };

  convertMarketAmountToUsd = (
    marketAmount: Decimal,
    marketDecimals: Decimal,
    normalizedMarketPrice: Decimal,
  ): Decimal => {
    return convertMarketAmountToUsd(marketAmount, marketDecimals, normalizedMarketPrice);
  };

  convertCollateralAmountToUsd = (
    collateralAmount: Decimal,
    collateralDecimals: Decimal,
    normalizedCollateralPrice: Decimal,
  ): Decimal => {
    return convertCollateralAmountToUsd(collateralAmount, collateralDecimals, normalizedCollateralPrice);
  };

  ////////////////////////////////////////////////////////////////
  //////////////////    SUBGRAPH HELPER    ///////////////////////
  ////////////////////////////////////////////////////////////////

  getPositionRefreshTxData = async (): Promise<{ txData: string }> => {
    const subgraphEndpoint = this.subgraphConfig.subgraphEndpoint ?? getPublicSubgraphEndpoint(this.rpcConfig.chainId);
    return await getPositionRefreshTxData(this.rpcConfig.chainId, subgraphEndpoint);
  };

  ////////////////////////////////////////////////////////////////
  //////////////////////    PAGES    /////////////////////////////
  ////////////////////////////////////////////////////////////////

  getMarketBorrowingRatePerHour = (
    market: Market,
  ): { borrowingRatePerHourLong: Decimal; borrowingRatePerHourShorts: Decimal } => {
    return getMarketBorrowingRatePerHour(market);
  };

  getMarketOpenInterestInUsd = (
    market: Market,
    normalizedMarketPrice: Decimal,
  ): { openInterestInUsdLongs: Decimal; openInterestInUsdShorts: Decimal } => {
    return getMarketOpenInterestInUsd(market, normalizedMarketPrice);
  };

  getPoolPageData = async (userAddress: string): Promise<UserVaultData[]> => {
    const subgraphEndpoint = this.subgraphConfig.subgraphEndpoint ?? getPublicSubgraphEndpoint(this.rpcConfig.chainId);
    return await getPoolPageData(subgraphEndpoint, userAddress);
  };

  getTotalOpenInterestInUsd = async (): Promise<Decimal> => {
    const subgraphEndpoint = this.subgraphConfig.subgraphEndpoint ?? getPublicSubgraphEndpoint(this.rpcConfig.chainId);
    const pythClient = await getPythClient(
      this.pythConfig.pythEndpoint,
      this.pythConfig.username,
      this.pythConfig.password,
      this.pythConfig.isStable,
    );

    return await getTotalOpenInterestInUsd(subgraphEndpoint, pythClient);
  };

  getPoitionId = (userAddress: string, positionNonce: BigInt, chain: Chain): string => {
    return getPositionId(userAddress, positionNonce, chain);
  };

  getUserPoitionId = async (userAddress: string, chain: Chain): Promise<string | null> => {
    return await getUserPositionId(userAddress, chain);
  };

  getUserPositionNonce = async (userAddress: string, chain: Chain): Promise<BigInt | null> => {
    return await getUserPositionNonce(userAddress, chain);
  };
}
