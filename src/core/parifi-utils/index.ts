import { Contract, ethers } from 'ethers';
import { Chain } from '@parifi/references';
import { contracts as parifiContracts } from '@parifi/references';
import { getLatestPricesFromPyth, getVaaPriceUpdateData, normalizePythPriceForParifi } from '../../pyth/pyth';
import { AxiosInstance } from 'axios';
import { executeTxUsingGelato } from '../../gelato';
import { getAllPendingOrders, getPythPriceIdsForPositionIds } from '../../subgraph';
import { BatchExecute } from '../../interfaces/subgraphTypes';
import { DEFAULT_BATCH_COUNT } from '../../common';
import { checkIfOrderCanBeSettled } from '../order-manager';

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
  pythClient: AxiosInstance,
): Promise<{ ordersCount: number }> => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const pendingOrders = await getAllPendingOrders(subgraphEndpoint, currentTimestamp, DEFAULT_BATCH_COUNT);
  if (pendingOrders.length == 0) return { ordersCount: 0 };

  const priceIds: string[] = [];

  // Populate the price ids array to fetch price update data
  pendingOrders.forEach((order) => {
    if (order.market?.pyth?.id) {
      priceIds.push(order.market.pyth.id);
    }
  });

  // Get Price update data and latest prices from Pyth
  const priceUpdateData = await getVaaPriceUpdateData(priceIds, pythClient);
  const pythLatestPrices = await getLatestPricesFromPyth(priceIds, pythClient);

  // Populate batched orders for settlement for orders that can be settled
  const batchedOrders: BatchExecute[] = [];

  pendingOrders.forEach((order) => {
    if (order.id) {
      // Pyth returns price id without '0x' at the start, hence the price id from order
      // needs to be formatted
      const orderPriceId = order.market?.pyth?.id ?? '0x';
      const formattedPriceId = orderPriceId.startsWith('0x') ? orderPriceId.substring(2) : orderPriceId;

      const assetPrice = pythLatestPrices.find((pythPrice) => pythPrice.id === formattedPriceId);
      const normalizedMarketPrice = normalizePythPriceForParifi(
        parseInt(assetPrice?.price.price ?? '0'),
        assetPrice?.price.expo ?? 0,
      );

      if (checkIfOrderCanBeSettled(order, normalizedMarketPrice)) {
        batchedOrders.push({
          id: order.id,
          priceUpdateData: priceUpdateData,
        });
        // We need these console logs for feedback to Tenderly actions and other scripts
        console.log('Order ID available for settlement:', order.id);
      } else {
        console.log('Order ID not available for settlement because of price mismatch:', order.id);
      }
    }
  });

  // Encode transaction data
  if (batchedOrders.length != 0) {
    const parifiUtils = getParifiUtilsInstance(chainId);
    const { data: encodedTxData } = await parifiUtils.batchSettleOrders.populateTransaction(batchedOrders);

    const taskId = await executeTxUsingGelato(
      parifiContracts[chainId].ParifiUtils.address,
      chainId,
      gelatoKey,
      encodedTxData,
    );
    // We need these console logs for feedback to Tenderly actions and other scripts
    console.log('Task ID:', taskId);
  }
  return { ordersCount: batchedOrders.length };
};

export const batchLiquidatePostionsUsingGelato = async (
  chainId: Chain,
  positionIds: string[],
  gelatoKey: string,
  subgraphEndpoint: string,
  pythClient: AxiosInstance,
): Promise<{ positionsCount: number }> => {
  // Get unique price ids for all the positions
  const priceIds = await getPythPriceIdsForPositionIds(subgraphEndpoint, positionIds);

  // Get Price update data and latest prices from Pyth
  const priceUpdateData = await getVaaPriceUpdateData(priceIds, pythClient);

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
    const { data: encodedTxData } = await parifiUtils.batchLiquidatePositions.populateTransaction(batchedPositions);

    const taskId = await executeTxUsingGelato(
      parifiContracts[chainId].ParifiUtils.address,
      chainId,
      gelatoKey,
      encodedTxData,
    );
    // We need these console logs for feedback to Tenderly actions and other scripts
    console.log('Task ID:', taskId);
  }
  return { positionsCount: batchedPositions.length };
};
