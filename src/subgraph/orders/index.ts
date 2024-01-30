import { request } from 'graphql-request';
import { Chain } from '../../common/chain';
import { getSubgraphEndpoint } from '../common';
import { fetchOrdersByIdQuery, fetchOrdersByUserQuery, fetchPendingOrdersQuery } from './subgraphQueries';
import { mapOrdersArrayToInterface, mapSingleOrderToInterface } from '../common/mapper';

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
