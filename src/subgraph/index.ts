import { getAllOrdersByUserAddress, getAllPendingOrders, getOrderById, getPythPriceIdsForOrderIds } from './orders';
import { Chain } from '../common/chain';
import { PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from '../types';
import { getAllPositionsByUserAddress, getPositionById } from './positions';
import { getAllMarketsFromSubgraph, getMarketById } from './markets';

export * from './common';
export * from './markets';
export * from './orders';
export * from './positions';

export class SubGraph {
  private rpcConfig: RpcConfig;
  private subGraphConfig: SubgraphConfig;

  constructor(rpcConfig: RpcConfig, subGraphConfig: SubgraphConfig) {
    this.rpcConfig = rpcConfig;
    this.subGraphConfig = subGraphConfig;
  }

  // orders
  public async getAllOrdersByUserAddress(userAddress: string) {
    await getAllOrdersByUserAddress(this.rpcConfig.chainId, userAddress, this.subGraphConfig.subgraphEndpoint);
  }

  public async getAllPendingOrders() {
    await getAllPendingOrders(this.rpcConfig.chainId, this.subGraphConfig.subgraphEndpoint);
  }

  public async getOrderById(orderId: string) {
    await getOrderById(this.rpcConfig.chainId, orderId, this.subGraphConfig.subgraphEndpoint);
  }

  public async getPythPriceIdsForOrderIds(orderIds: string[]) {
    await getPythPriceIdsForOrderIds(this.rpcConfig.chainId, orderIds, this.subGraphConfig.subgraphEndpoint);
  }

  // postions

  public async getAllPositionsByUserAddress(userAddress: string) {
    getAllPositionsByUserAddress(this.rpcConfig.chainId, userAddress, this.subGraphConfig.subgraphEndpoint);
  }

  public async getPositionById(positionId: string) {
    getPositionById(this.rpcConfig.chainId, positionId, this.subGraphConfig.subgraphEndpoint);
  }

  //markets

  public async getAllMarketsFromSubgraph() {
    getAllMarketsFromSubgraph(this.rpcConfig.chainId, this.subGraphConfig.subgraphEndpoint);
  }

  public async getMarketById(marketId: string) {
    getMarketById(this.rpcConfig.chainId, marketId, this.subGraphConfig.subgraphEndpoint);
  }
}
