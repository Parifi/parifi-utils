import { Contract, Signer, ethers } from 'ethers';
import { Chain } from '@parifi/references';
import { contracts as parifiContracts } from '@parifi/references';
import { getVaaPriceUpdateData, getLatestPricesFromPyth, normalizePythPriceForParifi } from '../../pyth/pyth';
import { AxiosInstance } from 'axios';
import { executeTxUsingGelato } from '../../relayers/gelato/gelato-function';
import { getAllPendingOrders, getPythPriceIdsForOrderIds, getPythPriceIdsForPositionIds } from '../../subgraph';
import { BatchExecute } from '../../interfaces/subgraphTypes';
import {
  DEFAULT_BATCH_COUNT,
  GAS_LIMIT_LIQUIDATION,
  GAS_LIMIT_SETTLEMENT,
  getPriceIdsForCollaterals,
} from '../../common';
import { checkIfOrderCanBeSettled } from '../order-manager';
import { InvalidValueError } from '../../error/invalid-value.error';

// Returns an Order Manager contract instance without signer
export const getParifiUtilsInstance = (chain: Chain): Contract => {
  try {
    return new ethers.Contract(parifiContracts[chain].ParifiUtils.address, parifiContracts[chain].ParifiUtils.abi);
  } catch (error) {
    throw error;
  }
};

export const batchSettlePendingOrdersUsingGelato = async (
  chainId: Chain,
  gelatoKey: string,
  subgraphEndpoint: string, // @todo Replace the endpoint string with graphQL instance
  isStablePyth: boolean,
  pythClient: AxiosInstance,
): Promise<{ ordersCount: number; gelatoTaskId: string }> => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const pendingOrders = await getAllPendingOrders(subgraphEndpoint, currentTimestamp, DEFAULT_BATCH_COUNT);
  if (pendingOrders.length == 0) {
    console.log('Orders not available for settlement');
    return { ordersCount: 0, gelatoTaskId: '0x' };
  }

  const priceIds: string[] = [];

  // Populate the price ids array to fetch price update data
  pendingOrders.forEach((order) => {
    if (order.market?.pyth?.id) {
      priceIds.push(order.market.pyth.id);
    }
  });

  // Get Price IDs of collateral tokens
  const priceIdsForCollaterals = getPriceIdsForCollaterals(isStablePyth);

  // Get Price update data and latest prices from Pyth
  const priceUpdateData = await getVaaPriceUpdateData(priceIds.concat(priceIdsForCollaterals), pythClient);
  const pythLatestPrices = await getLatestPricesFromPyth(priceIds, pythClient);

  // Populate batched orders for settlement for orders that can be settled
  const batchedOrders: BatchExecute[] = [];

  pendingOrders.forEach((order) => {
    if (order.id) {
      if (!order.market?.pyth?.id) {
        throw new InvalidValueError('orderPriceId');
      }
      // Pyth returns price id without '0x' at the start, hence the price id from order
      // needs to be formatted
      const orderPriceId = order.market?.pyth?.id;
      const formattedPriceId = orderPriceId.startsWith('0x') ? orderPriceId.substring(2) : orderPriceId;

      const assetPrice = pythLatestPrices.find((pythPrice) => pythPrice.id === formattedPriceId);
      if (!assetPrice?.price.price) {
        throw new InvalidValueError('assetPrice?.price.price');
      }

      const normalizedMarketPrice = normalizePythPriceForParifi(
        parseInt(assetPrice?.price.price),
        assetPrice?.price.expo,
      );

      if (checkIfOrderCanBeSettled(order, normalizedMarketPrice)) {
        batchedOrders.push({
          id: order.id,
          priceUpdateData: priceUpdateData,
        });
        // We need these console logs for feedback to Tenderly actions and other scripts
        // console.log('Order ID available for settlement:', order.id);
      } else {
        console.log('Order ID not available for settlement because of price mismatch:', order.id);
      }
    }
  });

  // Encode transaction data
  let taskId: string = '';
  if (batchedOrders.length != 0) {
    const parifiUtils = getParifiUtilsInstance(chainId);
    const { data: encodedTxData } = await parifiUtils.batchSettleOrders.populateTransaction(batchedOrders);

    const gelatoGasLimit = BigInt(batchedOrders.length * GAS_LIMIT_SETTLEMENT);

    taskId = await executeTxUsingGelato(
      parifiContracts[chainId].ParifiUtils.address,
      chainId,
      gelatoKey,
      encodedTxData,
      gelatoGasLimit,
    );
    // We need these console logs for feedback to Tenderly actions and other scripts
    console.log('Task ID:', taskId);
  }
  return { ordersCount: batchedOrders.length, gelatoTaskId: taskId };
};

export const batchLiquidatePostionsUsingGelato = async (
  chainId: Chain,
  positionIds: string[],
  gelatoKey: string,
  subgraphEndpoint: string,
  isStablePyth: boolean,
  pythClient: AxiosInstance,
): Promise<{ positionsCount: number; gelatoTaskId: string }> => {
  if (positionIds.length == 0) return { positionsCount: 0, gelatoTaskId: '0x' };

  // Get unique price ids for all the positions
  const priceIds = await getPythPriceIdsForPositionIds(subgraphEndpoint, positionIds);

  // Get Price IDs of collateral tokens
  const priceIdsForCollaterals = getPriceIdsForCollaterals(isStablePyth);

  // Get Price update data and latest prices from Pyth
  const priceUpdateData = await getVaaPriceUpdateData(priceIds.concat(priceIdsForCollaterals), pythClient);

  // Populate batched positions for positions that can be liquidated
  const batchedPositions: BatchExecute[] = [];
  positionIds.forEach((positionId) => {
    batchedPositions.push({
      id: positionId,
      priceUpdateData: priceUpdateData,
    });
  });

  // Encode transaction data
  let taskId: string = '';
  if (batchedPositions.length != 0) {
    const parifiUtils = getParifiUtilsInstance(chainId);
    const { data: encodedTxData } = await parifiUtils.batchLiquidatePositions.populateTransaction(batchedPositions);

    const gelatoGasLimit = BigInt(batchedPositions.length * GAS_LIMIT_LIQUIDATION);

    taskId = await executeTxUsingGelato(
      parifiContracts[chainId].ParifiUtils.address,
      chainId,
      gelatoKey,
      encodedTxData,
      gelatoGasLimit,
    );
    // We need these console logs for feedback to Tenderly actions and other scripts
    console.log('Task ID:', taskId);
  }
  return { positionsCount: batchedPositions.length, gelatoTaskId: taskId };
};

// Batch settle orders using Gelato for OrderIds
export const batchSettleOrdersUsingGelato = async (
  chainId: Chain,
  orderIds: string[],
  priceUpdateData: string[],
  gelatoKey: string,
): Promise<{ ordersCount: number; gelatoTaskId: string }> => {
  if (orderIds.length == 0) {
    console.log('Orders not available for settlement');
    return { ordersCount: 0, gelatoTaskId: '0x' };
  }
  // Populate batched orders for settlement for orders that can be settled
  const batchedOrders: BatchExecute[] = [];

  orderIds.forEach((orderId) => {
    batchedOrders.push({
      id: orderId,
      priceUpdateData: priceUpdateData,
    });
  });

  // Encode transaction data
  let taskId: string = '';
  if (batchedOrders.length != 0) {
    const parifiUtils = getParifiUtilsInstance(chainId);
    const { data: encodedTxData } = await parifiUtils.batchSettleOrders.populateTransaction(batchedOrders);

    const gelatoGasLimit = BigInt(batchedOrders.length * GAS_LIMIT_SETTLEMENT);

    taskId = await executeTxUsingGelato(
      parifiContracts[chainId].ParifiUtils.address,
      chainId,
      gelatoKey,
      encodedTxData,
      gelatoGasLimit,
    );
    // We need these console logs for feedback to Tenderly actions and other scripts
    console.log('Task ID:', taskId);
  }
  return { ordersCount: batchedOrders.length, gelatoTaskId: taskId };
};

// Batch settle orders using Wallet for OrderIds
export const batchSettleOrdersUsingWallet = async (
  chainId: Chain,
  orderIds: string[],
  priceUpdateData: string[],
  wallet: Signer,
): Promise<{ txHash: string }> => {
  if (orderIds.length == 0) {
    console.log('Orders not available for settlement');
    return { txHash: '0x' };
  }

  // Populate batched orders for settlement for orders that can be settled
  const batchedOrders: BatchExecute[] = [];

  orderIds.forEach((orderId) => {
    batchedOrders.push({
      id: orderId,
      priceUpdateData: priceUpdateData,
    });
  });

  if (batchedOrders.length != 0) {
    const parifiUtilsContract = new ethers.Contract(
      parifiContracts[chainId].ParifiUtils.address,
      parifiContracts[chainId].ParifiUtils.abi,
      wallet,
    );

    const provider = await wallet.provider;
    if (provider) {
      const estimatedGas = await parifiUtilsContract.batchSettleOrders.estimateGas(batchedOrders);
      const estimatedGasPrice = await provider.getFeeData();
      console.log(estimatedGas);
      console.log(estimatedGasPrice);
      const tx1 = await parifiUtilsContract.batchSettleOrders(batchedOrders, {
        gasLimit: estimatedGas,
        maxFeePerGas: estimatedGasPrice.maxFeePerGas,
        maxPriorityFeePerGas: estimatedGasPrice.maxPriorityFeePerGas,
      });
      await tx1.wait();
      return { txHash: tx1.hash };
    } else {
      const tx2 = await parifiUtilsContract.batchSettleOrders(batchedOrders);
      await tx2.wait();
      return { txHash: tx2.hash };
    }
  }
  return { txHash: '0x' };
};

// Returns encoded tx data to batch settle multiple orders
export const getBatchSettleTxData = async (
  chainId: Chain,
  subgraphEndpoint: string,
  pythClient: AxiosInstance,
  orderIds: string[],
): Promise<{ txData: string }> => {
  if (orderIds.length == 0) {
    console.log('Orders not available for settlement');
    return { txData: '0x' };
  }

  const priceIds = await getPythPriceIdsForOrderIds(subgraphEndpoint, orderIds);

  // Get Price IDs of collateral tokens
  const priceIdsForCollaterals = getPriceIdsForCollaterals(true);

  // Get Price update data and latest prices from Pyth
  const priceUpdateData = await getVaaPriceUpdateData(priceIds.concat(priceIdsForCollaterals), pythClient);

  // Populate batched orders for settlement for orders that can be settled
  const batchedOrders: BatchExecute[] = [];

  orderIds.forEach((orderId) => {
    batchedOrders.push({
      id: orderId,
      priceUpdateData: priceUpdateData,
    });
  });

  if (batchedOrders.length != 0) {
    const parifiUtils = getParifiUtilsInstance(chainId);
    const { data: txData } = await parifiUtils.batchSettleOrders.populateTransaction(batchedOrders);
    return { txData };
  }
  return { txData: '0x' };
};

// Returns encoded tx data to batch liquidate multiple positions
export const getBatchLiquidateTxData = async (
  chainId: Chain,
  subgraphEndpoint: string,
  pythClient: AxiosInstance,
  positionIds: string[],
): Promise<{ txData: string }> => {
  if (positionIds.length == 0) return { txData: '0x' };

  // Get unique price ids for all the positions
  const priceIds = await getPythPriceIdsForPositionIds(subgraphEndpoint, positionIds);

  // Get Price IDs of collateral tokens
  const priceIdsForCollaterals = getPriceIdsForCollaterals(true);

  // Get Price update data from Pyth
  const priceUpdateData = await getVaaPriceUpdateData(priceIds.concat(priceIdsForCollaterals), pythClient);

  // Populate batched positions for positions that can be liquidated
  const batchedPositions: BatchExecute[] = [];
  positionIds.forEach((positionId) => {
    batchedPositions.push({
      id: positionId,
      priceUpdateData: priceUpdateData,
    });
  });

  // Encode transaction data
  if (batchedPositions.length != 0) {
    const parifiUtils = getParifiUtilsInstance(chainId);
    const { data: txData } = await parifiUtils.batchLiquidatePositions.populateTransaction(batchedPositions);
    return { txData };
  }
  return { txData: '0x' };
};
