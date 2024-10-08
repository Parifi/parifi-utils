import { formatEther } from 'ethers';
import {  PriceFeedSnapshot, PythData, Token } from '../interfaces/subgraphTypes';
import { Market, Order, Position, Wallet } from '../interfaces/sdkTypes';

////////////////////////////////////////////////////////////////
//////////////////////    Wallet   ////////////////////////////
////////////////////////////////////////////////////////////////

export const mapSubgraphResponseToWalletInterface = (response: any): Wallet | undefined => {
  if (response === null) return undefined;
  try {
    return {
      id: response.id,
      totalOrdersCount: response.totalOrdersCount,
      totalPositionsCount: response.totalPositionsCount,
      totalRealizedPnlPositions: response.totalRealizedPnlPositions,
      openPositionCount: response.openPositionCount,
      countProfitablePositions: response.countProfitablePositions,
      countLossPositions: response.countLossPositions,
      countLiquidatedPositions: response.countLiquidatedPositions,
      totalVolumeInUsd: response.totalVolumeInUsd,
      totalVolumeInUsdLongs: response.totalVolumeInUsdLongs,
      totalVolumeInUsdShorts: response.totalVolumeInUsdShorts,
      totalAccruedBorrowingFeesInUsd: response.totalAccruedBorrowingFeesInUsd,
    };
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

////////////////////////////////////////////////////////////////
//////////////////////    MARKET    ////////////////////////////
////////////////////////////////////////////////////////////////

export const mapSingleMarketToInterface = (response: any):  Market| undefined => {
  if (response === null) return undefined;
  try {
    return {
      id: response.id,
      marketName: response.marketName,
      marketSymbol: response.marketSymbol,
      feedId: response.feedId,
      size: response.size,
      currentFundingRate: response.currentFundingRate,
      currentFundingVelocity: response.currentFundingVelocity,
      maxFundingVelocity: response.maxFundingVelocity,
      skewScale: response.skewScale,
      makerFee: response.makerFee,
      takerFee: response.takerFee,
      skew: response.skew,
      maxMarketValue: response.maxMarketValue,
      maxOpenInterest: response.maxOpenInterest,
      interestRate: response.interestRate,
    };
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};
export const mapWalletsArrayToInterface = (response: any): Wallet[] | undefined => {
  if (response === null) return undefined;
  try {
    return response.accounts.map((account: Wallet) => {
      return mapSubgraphResponseToWalletInterface(account);
    });
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};
export const mapMarketsArrayToInterface = (response: any): Market[] | undefined => {
  if (response === null) return undefined;
  try {
    return response.markets.map((market: Market) => {
      return mapSingleMarketToInterface(market);
    });
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

////////////////////////////////////////////////////////////////
//////////////////////    ORDERS    ////////////////////////////
////////////////////////////////////////////////////////////////

export const mapSingleOrderToInterface = (response: any): Order | undefined => {
  if (response === null) return undefined;
  console.log('response', response);
  console.log('response', response.id);
  try {
    return {
      id: response.id,
      market: mapSingleMarketToInterface(response.market),
      user: mapSubgraphResponseToWalletInterface(response.user),
      isLimitOrder: response.isLimitOrder,
      deadline: response.expirationTime,
      deltaCollateral: response.deltaCollateral,
      deltaSize: response.deltaSize,
      deltaSizeUsd: response.deltaSizeUsd,
      expectedPrice: response.expectedPrice,
      executionFee: response.collectedFees,
      txHash: response.txHash,
      createdTimestamp: response.createdTimestamp,
      status: response.status,
      settledTxHash: response.settledTxHash,
      settledTimestamp: response.settledTimestamp,
      settledTimestampISO: response.settledTimestampISO,
      executionPrice: response.executionPrice,
      settledBy: response.settledBy ? mapSubgraphResponseToWalletInterface(response.settledBy) : undefined,
      positionId: response.position ? response.position.id : undefined,
      formattedDeltaSize:formatEther(response.deltaSize)
    };
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

export const mapOrdersArrayToInterface = (response: any): Order[] | undefined => {
  if (response === null) return undefined;
  try {
    return response.orders.map((order: Order) => {
      return mapSingleOrderToInterface(order);
    });
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

////////////////////////////////////////////////////////////////
//////////////////////    POSITION    //////////////////////////
////////////////////////////////////////////////////////////////

export const mapSinglePositionToInterface = (response: any): Position | undefined => {
  if (response === null) return undefined;
  try {
    return {
      id: response.id,
      market: response.market ? mapSingleMarketToInterface(response.market) : undefined,
      user: response.user ? mapSubgraphResponseToWalletInterface(response.user) : undefined,
      isLong: response.isLong,
      positionCollateral: response.positionCollateral,
      positionSize: response.positionSize,
      avgPrice: response.avgPrice,
      avgPriceDec: response.avgPriceDec,
      status: response.status,
      accountId:response.account.accountId,
      txHash: response.txHash,
      liquidationTxHash: response.liquidationTxHash,
      closingPrice: response.closingPrice,
      realizedPnl: response.realizedPnl,
      realizedFee: response.realizedFee,
      netRealizedPnl: response.netRealizedPnl,
      createdTimestamp: response.createdTimestamp,
      lastRefresh: response.lastRefresh,
      lastRefreshISO: response.lastRefreshISO,
      canBeLiquidated: response.canBeLiquidated,
      accruedBorrowingFees:response.accruedBorrowingFees,
    };
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

export const mapPositionsArrayToInterface = (response: any): Position[] | undefined => {
  if (response === null) return undefined;

  try {
    return response.positions.map((position: Position) => {
      return mapSinglePositionToInterface(position);
    });
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

////////////////////////////////////////////////////////////////
//////////////////////    TOKEN    /////////////////////////////
////////////////////////////////////////////////////////////////

export const mapSubgraphResponseToTokenInterface = (response: any): Token | undefined => {
  if (response === null) return undefined;

  try {
    return {
      id: response.id,
      name: response.name,
      symbol: response.symbol,
      decimals: response.decimals,
      pyth: response.pyth ? mapSubgraphResponseToPythDataInterface(response.pyth) : undefined,
      lastPriceUSD: response.lastPriceUSD,
      lastPriceTimestamp: response.lastPriceTimestamp,
    };
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

////////////////////////////////////////////////////////////////
////////////////////////    PYTH    ////////////////////////////
////////////////////////////////////////////////////////////////

export const mapSubgraphResponseToPriceFeedSnapshotInterface = (response: any): PriceFeedSnapshot | undefined => {
  if (response === null) return undefined;

  try {
    return {
      id: response.id,
      priceId: response.priceId,
      publishTime: response.publishTime,
      price: response.price,
      confidence: response.confidence,
    };
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

export const mapSubgraphResponseToPythDataInterface = (response: any): PythData | undefined => {
  if (response === null) return undefined;

  try {
    return {
      id: response.id,
      marketId: response.marketId,
      tokenAddress: response.tokenAddress,
      price: response.price,
      lastUpdatedTimestamp: response.lastUpdatedTimestamp,
    };
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};
