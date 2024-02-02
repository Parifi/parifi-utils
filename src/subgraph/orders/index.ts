import { request } from 'graphql-request';
import { Chain } from '../../common/chain';
import { Order, getSubgraphEndpoint } from '../common';
import {
  fetchOrdersByIdQuery,
  fetchOrdersByUserQuery,
  fetchPendingOrdersQuery,
  fetchPriceIdsFromOrderIdsQuery,
} from './subgraphQueries';
import { mapOrdersArrayToInterface, mapSingleOrderToInterface } from '../common/mapper';
import { EMPTY_BYTES32, getUniqueValuesFromArray } from '../../common';

// Get all order by a user address
export const getAllOrdersByUserAddress = async (chainId: Chain, userAddress: string, count: number = 10) => {
  const subgraphEndpoint = getSubgraphEndpoint(chainId);

  const subgraphResponse = await request(subgraphEndpoint, fetchOrdersByUserQuery(userAddress, count));
  return mapOrdersArrayToInterface(subgraphResponse);
};

// Get all pending orders that are not yet settled/cancelled or expired
export const getAllPendingOrders = async (
  chainId: Chain,
  timestamp: number = Math.floor(Date.now() / 1000),
  count: number = 10,
) => {
  const subgraphEndpoint = getSubgraphEndpoint(chainId);

  const subgraphResponse = await request(subgraphEndpoint, fetchPendingOrdersQuery(timestamp, count));
  return mapOrdersArrayToInterface(subgraphResponse);
};

// Get order from subgraph by order ID
export const getOrderById = async (chainId: Chain, orderId: string) => {
  const subgraphEndpoint = getSubgraphEndpoint(chainId);

  const formattedOrderId = orderId.toLowerCase();

  const subgraphResponse: any = await request(subgraphEndpoint, fetchOrdersByIdQuery(formattedOrderId));
  return mapSingleOrderToInterface(subgraphResponse.order);
};

// Get all price IDs of tokens related to the orders ids
export const getPythPriceIdsForOrderIds = async (chainId: Chain, orderIds: string[]) => {
  const subgraphEndpoint = getSubgraphEndpoint(chainId);
  const formattedOrderIds: string[] = orderIds.map((orderId) => orderId.toLowerCase());

  const subgraphResponse: any = await request(subgraphEndpoint, fetchPriceIdsFromOrderIdsQuery(formattedOrderIds));
  const priceIds: string[] = [];

  try {
    const orders: Order[] = mapOrdersArrayToInterface(subgraphResponse) || [];
    if (orders.length != 0) {
      orders.map((order) => {
        if (order.market?.pyth?.id) {
          priceIds.push(order.market?.pyth?.id);
        }
      });
    }
    const uniquePriceIds = getUniqueValuesFromArray(priceIds);

    // Remove empty (0x00) price ids for orders where the Pyth data is not set
    return uniquePriceIds.filter((id) => id !== EMPTY_BYTES32);
  } catch (error) {
    console.log('Error mapping price ids');
    throw error;
  }
};
