import {
  Market,
  Order,
  Position,
  PriceFeedSnapshot,
  PythData,
  Token,
  Wallet,
} from '../interfaces/subgraphTypes';

////////////////////////////////////////////////////////////////
//////////////////////    ACCOUNT   ////////////////////////////
////////////////////////////////////////////////////////////////

export const mapSubgraphResponseToAccountInterface = (response: any): Wallet | undefined => {
  if (response === null) return undefined;
  try {
    return {
      id: response.id,
      totalOrdersCount: response.totalOrdersCount,
      totalPositionsCount: response.totalPositionsCount,
      totalRealizedPnlPositions: response.totalRealizedPnlPositions,
      openPositionCount:response.openPositionCount,
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

export const mapSingleMarketToInterface = (response: any): Market | undefined => {
  if (response === null) return undefined;
  try {
    return {
      id: response.id,
      name: response.marketName,
      symbol : response.marketSymbol,
      feedId: response.feedId,
      size:response.size,
      currentFundingRate: response.currentFundingRate,
      currentFundingVelocity: response.currentFundingVelocity,
      maxFundingVelocity:response.maxFundingVelocity,
      skewScale:response.skewScale,
      makerFee:response.makerFee,
      takerFee:response.takerFee,
      skew:response.skew

    };
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
  try {
    return {
      id: response.id,
      market:  mapSingleMarketToInterface(response.market),
      user:  mapSubgraphResponseToAccountInterface(response.user),
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
      settledBy: response.settledBy ? mapSubgraphResponseToAccountInterface(response.settledBy) : undefined,
      positionId: response.position ? response.position.id : undefined,
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
      user: response.user ? mapSubgraphResponseToAccountInterface(response.user) : undefined,
      isLong: response.isLong,
      positionCollateral: response.positionCollateral,
      positionSize: response.positionSize,
      avgPrice: response.avgPrice,
      avgPriceDec: response.avgPriceDec,
      status: response.status,
      txHash: response.txHash,
      liquidationTxHash: response.liquidationTxHash,
      closingPrice: response.closingPrice,
      realizedPnl: response.realizedPnl,
      realizedPnlCollateral: response.realizedPnlCollateral,
      realizedFee: response.realizedFee,
      netRealizedPnl: response.netRealizedPnl,
      createdTimestamp: response.createdTimestamp,
      lastRefresh: response.lastRefresh,
      lastRefreshISO: response.lastRefreshISO,
      canBeLiquidated: response.canBeLiquidated,
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

