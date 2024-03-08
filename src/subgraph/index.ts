import { getAllOrdersByUserAddress, getAllPendingOrders, getOrderById, getPythPriceIdsForOrderIds } from './orders';
import { RpcConfig, SubgraphConfig } from '../interfaces/classConfigs';
import {
  getAllPositionsByUserAddress,
  getClosedPositionsByUserAddress,
  getLiquidatedPositionsByUserAddress,
  getOpenPositionsByUserAddress,
  getPositionById,
} from './positions';
import { getAllMarketsFromSubgraph, getMarketById } from './markets';
import { Market, Order, Position, Vault } from '../interfaces/subgraphTypes';
import { Chain } from '@parifi/references';
import request, { GraphQLClient } from 'graphql-request';
import { getPublicSubgraphEndpoint } from './common';
import { getAllVaults } from './vaults';

export * from './common';
export * from './markets';
export * from './orders';
export * from './positions';

export class Subgraph {
  // The rpcConfig and subgraphConfig objects that are passed to the class will only
  // be used for the creation of the required fields for initialization
  // @todo Add authentication to Graph QL Client in a separate PR
  // Use the below graphQLClient for all requests to the subgraph
  public graphQLClient: GraphQLClient;

  constructor(
    private rpcConfig: RpcConfig,
    private subgraphConfig: SubgraphConfig,
  ) {
    // Initialize the Graph QL Client using the config received
    if (subgraphConfig.subgraphEndpoint) {
      this.graphQLClient = new GraphQLClient(subgraphConfig.subgraphEndpoint);
    } else {
      this.graphQLClient = new GraphQLClient(getPublicSubgraphEndpoint(rpcConfig.chainId));
    }
  }

  // Returns the configured subgraph endpoint if set, otherwise returns public subgraph endpoint
  public getSubgraphEndpoint(chainId: Chain): string {
    if (this.subgraphConfig.subgraphEndpoint) {
      return this.subgraphConfig.subgraphEndpoint;
    }
    return getPublicSubgraphEndpoint(chainId);
  }

  // Execute the provided subgraph query using the configured subgraph endpoint and configuration values
  public async executeSubgraphQuery(query: string): Promise<any> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    try {
      const subgraphResponse = await request(subgraphEndpoint, query);
      return subgraphResponse;
    } catch (error) {
      throw error;
    }
  }

  ////////////////////////////////////////////////////////////////
  //////////////////////    ORDERS    ////////////////////////////
  ////////////////////////////////////////////////////////////////
  public async getAllOrdersByUserAddress(userAddress: string, count: number, skip: number): Promise<Order[]> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return await getAllOrdersByUserAddress(subgraphEndpoint, userAddress, count, skip);
  }

  public async getAllPendingOrders(timestamp: number, count: number, skip: number): Promise<Order[]> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return await getAllPendingOrders(subgraphEndpoint, timestamp, count, skip);
  }

  public async getOrderById(orderId: string): Promise<Order> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return await getOrderById(subgraphEndpoint, orderId);
  }

  public async getPythPriceIdsForOrderIds(orderIds: string[]): Promise<string[]> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return await getPythPriceIdsForOrderIds(subgraphEndpoint, orderIds);
  }

  ////////////////////////////////////////////////////////////////
  //////////////////////    POSITION    //////////////////////////
  ////////////////////////////////////////////////////////////////
  public async getAllPositionsByUserAddress(
    userAddress: string,
    count: number = 20,
    skip?: number,
  ): Promise<Position[]> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return await getAllPositionsByUserAddress(subgraphEndpoint, userAddress, count, skip);
  }

  public async getPositionById(positionId: string): Promise<Position> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return getPositionById(subgraphEndpoint, positionId);
  }

  public async getOpenPositionsByUserAddress(
    userAddress: string,
    count: number = 20,
    skip?: number,
  ): Promise<Position[]> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return await getOpenPositionsByUserAddress(subgraphEndpoint, userAddress, count, skip);
  }

  public async getClosedPositionsByUserAddress(
    userAddress: string,
    count: number = 20,
    skip?: number,
  ): Promise<Position[]> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return await getClosedPositionsByUserAddress(subgraphEndpoint, userAddress, count, skip);
  }

  public async getLiquidatedPositionsByUserAddress(
    userAddress: string,
    count: number = 20,
    skip?: number,
  ): Promise<Position[]> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return await getLiquidatedPositionsByUserAddress(subgraphEndpoint, userAddress, count, skip);
  }
  ////////////////////////////////////////////////////////////////
  //////////////////////    MARKET    ////////////////////////////
  ////////////////////////////////////////////////////////////////

  public async getAllMarketsFromSubgraph(): Promise<Market[]> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return getAllMarketsFromSubgraph(subgraphEndpoint);
  }

  public async getMarketById(marketId: string): Promise<Market> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return getMarketById(subgraphEndpoint, marketId);
  }

  ////////////////////////////////////////////////////////////////
  //////////////////////    VAULTS    ////////////////////////////
  ////////////////////////////////////////////////////////////////

  public async getAllVaults(): Promise<Vault[]> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return getAllVaults(subgraphEndpoint);
  }
}
