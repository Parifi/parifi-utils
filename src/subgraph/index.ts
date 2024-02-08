import { getAllOrdersByUserAddress, getAllPendingOrders, getOrderById, getPythPriceIdsForOrderIds } from './orders';
import { RpcConfig, SubgraphConfig } from '../types';
import { getAllPositionsByUserAddress, getPositionById } from './positions';
import { getAllMarketsFromSubgraph, getMarketById } from './markets';
import { Market, Order, Position } from './common';

export * from './common';
export * from './markets';
export * from './orders';
export * from './positions';

export class SubGraph {
  constructor(
    private rpcConfig: RpcConfig,
    private subGraphConfig: SubgraphConfig,
  ) {}

  // orders
  public async getAllOrdersByUserAddress(userAddress: string, count: number, skip: number): Promise<Order[]> {
    return await getAllOrdersByUserAddress(
      this.rpcConfig.chainId,
      userAddress,
      this.subGraphConfig.subgraphEndpoint,
      count,
      skip,
    );
  }

  public async getAllPendingOrders(count: number, skip: number): Promise<Order[]> {
    return await getAllPendingOrders(this.rpcConfig.chainId, this.subGraphConfig.subgraphEndpoint, count, skip);
  }

  public async getOrderById(orderId: string): Promise<Order> {
    return await getOrderById(this.rpcConfig.chainId, orderId, this.subGraphConfig.subgraphEndpoint);
  }

  public async getPythPriceIdsForOrderIds(orderIds: string[]): Promise<string[]> {
    return await getPythPriceIdsForOrderIds(this.rpcConfig.chainId, orderIds, this.subGraphConfig.subgraphEndpoint);
  }

  // postions

  public async getAllPositionsByUserAddress(userAddress: string, count: number, skip: number): Promise<Position[]> {
    return getAllPositionsByUserAddress(
      this.rpcConfig.chainId,
      userAddress,
      this.subGraphConfig.subgraphEndpoint,
      count,
      skip,
    );
  }

  public async getPositionById(positionId: string): Promise<Position> {
    return getPositionById(this.rpcConfig.chainId, positionId, this.subGraphConfig.subgraphEndpoint);
  }

  //markets

  public async getAllMarketsFromSubgraph(): Promise<Market[]> {
    return getAllMarketsFromSubgraph(this.rpcConfig.chainId, this.subGraphConfig.subgraphEndpoint);
  }

  public async getMarketById(marketId: string): Promise<Market> {
    return getMarketById(this.rpcConfig.chainId, marketId, this.subGraphConfig.subgraphEndpoint);
  }
}
