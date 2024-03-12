import { getAllOrdersByUserAddress, getAllPendingOrders, getOrderById, getPythPriceIdsForOrderIds } from './orders';
import { PythConfig, RpcConfig, SubgraphConfig } from '../interfaces/classConfigs';
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
import { GraphQLClient } from 'graphql-request';
import { getPublicSubgraphEndpoint } from './common';
import { getAllVaults, getChainVaultData, getUserVaultDataByChain } from './vaults';
import { Pyth } from '../pyth';
import Decimal from 'decimal.js';
import { PRICE_FEED_DECIMALS } from '../common';

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
  public pyth: Pyth;

  constructor(
    private rpcConfig: RpcConfig,
    private subgraphConfig: SubgraphConfig,
    pythConfig: PythConfig,
  ) {
    this.pyth = new Pyth(pythConfig);
    // Initialize the Graph QL Client using the config received
    if (subgraphConfig.subgraphEndpoint) {
      this.graphQLClient = new GraphQLClient(subgraphConfig.subgraphEndpoint);
    } else {
      this.graphQLClient = new GraphQLClient(getPublicSubgraphEndpoint(rpcConfig.chainId));
    }
  }
  async init() {
    await this.pyth.initPyth();
  }

  // Returns the configured subgraph endpoint if set, otherwise returns public subgraph endpoint
  public getSubgraphEndpoint(chainId: Chain): string {
    if (this.subgraphConfig.subgraphEndpoint) {
      return this.subgraphConfig.subgraphEndpoint;
    }
    return getPublicSubgraphEndpoint(chainId);
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

  public async getChainVaultData(): Promise<Vault[]> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return getChainVaultData(this.rpcConfig.chainId, subgraphEndpoint);
  }

  public async getUserVaultDataByChain(userAddress: string): Promise<Vault[]> {
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    return getUserVaultDataByChain(this.rpcConfig.chainId, subgraphEndpoint, userAddress);
  }

  public async getTotalPoolValue() {
    await this.init();
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    const vaults = await getChainVaultData(this.rpcConfig.chainId, subgraphEndpoint);
    const priceIds = vaults.map((v) => v.depositToken?.pyth?.id);
    const res = await this.pyth.getLatestPricesFromPyth(priceIds as string[]);
    const price = res.map((pythPrice) => {
      const normalizedPrice = this.pyth.normalizePythPriceForParifi(
        Number(pythPrice.price.price),
        pythPrice.price.expo,
      );
      const colletralPrice = new Decimal(normalizedPrice).div(10 ** PRICE_FEED_DECIMALS);
      const returnObj = { priceId: `0x${pythPrice.id}`, normalizedPrice: colletralPrice };
      return returnObj;
    });

    function getNormalizedPriceById(
      priceId: string,
      prices: { priceId: string | undefined; normalizedPrice: Decimal }[],
    ) {
      // Loop through the prices array
      for (const price of prices) {
        // Check if the priceId matches
        if (price.priceId == priceId) {
          // Return the normalizedPrice if matched
          return price.normalizedPrice;
        }
      }
      // Return null if no matching priceId found
      return null;
    }

    const data = vaults.map((vault) => {
      const normalizedPrice = getNormalizedPriceById(vault.depositToken?.pyth?.id as string, price);
      const totatVaultValue =
        (Number(vault.totalAssets) / 10 ** (vault.vaultDecimals || 0)) * Number(normalizedPrice || 0);
      const returnObj = {
        totalAssets: vault.totalAssets,
        decimal: vault.vaultDecimals,
        normalizedPrice: normalizedPrice,
        Symbol: vault.depositToken?.symbol,
        priceId: vault.depositToken?.pyth?.id,
        totatVaultValue: totatVaultValue,
      };
      return returnObj;
    });
    const totalPoolValue = data.reduce((a, b) => a + b.totatVaultValue, 0);
    return { data, totalPoolValue };
  }

  public async getMyTotalPoolValue(userAddress: string) {
    await this.init();
    const subgraphEndpoint = this.getSubgraphEndpoint(this.rpcConfig.chainId);
    const vaults = await getUserVaultDataByChain(this.rpcConfig.chainId, subgraphEndpoint, userAddress);
    if (vaults.length === 0) {
      return { data: 0, myTotalPoolValue: 0 };
    }
    const priceIds = vaults.map((v) => v.vault.depositToken?.pyth?.id);
    const res = await this.pyth.getLatestPricesFromPyth(priceIds as string[]);
    const price = res.map((pythPrice) => {
      const normalizedPrice = this.pyth.normalizePythPriceForParifi(
        Number(pythPrice.price.price),
        pythPrice.price.expo,
      );
      const colletralPrice = new Decimal(normalizedPrice).div(10 ** PRICE_FEED_DECIMALS);
      const returnObj = { priceId: `0x${pythPrice.id}`, normalizedPrice: colletralPrice };
      return returnObj;
    });

    function getNormalizedPriceById(
      priceId: string,
      prices: { priceId: string | undefined; normalizedPrice: Decimal }[],
    ) {
      // Loop through the prices array
      for (const price of prices) {
        // Check if the priceId matches
        if (price.priceId == priceId) {
          // Return the normalizedPrice if matched
          return price.normalizedPrice;
        }
      }
      // Return null if no matching priceId found
      return null;
    }

    const data = vaults.map((vault) => {
      const normalizedPrice = getNormalizedPriceById(vault.vault.depositToken?.pyth?.id as string, price);
      const vaultPerShare = vault.vault.assetsPerShare;
      const userShare = vault.sharesBalance;
      const myBalance =
        (Number(userShare || 0) * Number(vaultPerShare || 0)) /
        Number(10 ** (vault.vault?.vaultDecimals || 0)) /
        Number(10 ** parseInt(vault.vault.depositToken?.decimals || ''));

      const totatVaultValue = myBalance * Number(normalizedPrice || 0);
      const returnObj = {
        myBalance: myBalance,
        normalizedPrice: normalizedPrice,
        Symbol: vault.vault.depositToken?.symbol,
        priceId: vault.vault.depositToken?.pyth?.id,
        totatVaultValue: totatVaultValue,
      };
      return returnObj;
    });
    const myTotalPoolValue = data.reduce((a, b) => a + b.totatVaultValue, 0);
    return { data, myTotalPoolValue };
  }
}
