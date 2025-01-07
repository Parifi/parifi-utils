import { request } from 'graphql-request';
import { fetchOrdersByIdQuery, fetchOrdersByUserQuery } from './subgraphQueries';
import { mapResponseToOrder, mapResponseToSnxAccountArray } from '../../common/subgraphMapper';
import { NotFoundError } from '../../error/not-found.error';
import { Order, SnxAccount } from '../../interfaces/sdkTypes';

// Get all orders by a user address
export const getAllOrdersByUserAddress = async (
  subgraphEndpoint: string,
  userAddress: string,
  count: number = 10,
  skip: number = 0,
): Promise<SnxAccount[]> => {
  try {
    const subgraphResponse: any = await request(subgraphEndpoint, fetchOrdersByUserQuery(userAddress, count, skip));
    const snxAccounts = mapResponseToSnxAccountArray(subgraphResponse?.snxAccounts);
    return snxAccounts ?? [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Get order from subgraph by order ID
export const getOrderById = async (subgraphEndpoint: string, orderId: string): Promise<Order> => {
  try {
    let subgraphResponse: any = await request(subgraphEndpoint, fetchOrdersByIdQuery(orderId));

    console.log('subgraph response:', subgraphResponse);
    const order = mapResponseToOrder(subgraphResponse?.order);
    if (order) return order;
    throw new NotFoundError('Order id not found');
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new NotFoundError('Order id not found');
  }
};
