import { formatEther, formatUnits } from 'ethers';
import { PriceFeedSnapshot, PythData, Token } from '../interfaces/subgraphTypes';
import { CollateralDeposit, Market, Order, Position, SnxAccount, Wallet } from '../interfaces/sdkTypes';
import { Market as MarketSg } from '../interfaces/subgraphTypes';

////////////////////////////////////////////////////////////////
//////////////////////    Wallet   ////////////////////////////
////////////////////////////////////////////////////////////////

export const mapResponseToWallet = (response: any): Wallet | undefined => {
  if (!response) return undefined;
  try {
    return {
      id: response.id,
      // snxAccounts: mapSnxAccountsArray(response.snxAccounts)
    };
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

export const mapWalletsArrayToInterface = (response: any): Wallet[] | undefined => {
  if (!response) return undefined;
  try {
    return response.accounts.map((account: Wallet) => {
      return mapResponseToWallet(account);
    });
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

////////////////////////////////////////////////////////////////
//////////////////////    SNX Account   ////////////////////////
////////////////////////////////////////////////////////////////

export const mapResponseToSnxAccount = (response: any): SnxAccount | undefined => {
  if (!response) return undefined;

  return {
    id: response.id,
    type: response.type,
    accountId: response.accountId,
    owner: response.owner,
    totalOrdersCount: response.totalOrdersCount,
    totalPositionsCount: response.totalPositionsCount,
    openPositionCount: response.openPositionCount,
    countProfitablePositions: response.countProfitablePositions,
    countLossPositions: response.countLossPositions,
    countLiquidatedPositions: response.countLiquidatedPositions,
    totalRealizedPnlPositions: response.totalRealizedPnlPositions,
    totalVolumeInUsd: response.totalVolumeInUsd,
    totalVolumeInUsdLongs: response.totalVolumeInUsdLongs,
    totalVolumeInUsdShorts: response.totalVolumeInUsdShorts,
    totalAccruedBorrowingFeesInUsd: response.totalAccruedBorrowingFeesInUsd,
    integratorFeesGenerated: response.integratorFeesGenerated,
    orders: response.orders,
    positions: response.positions,
    collateralDeposits: response.collateralDeposits,
  };
};

export const mapResponseToSnxAccountArray = (response: any): SnxAccount[] | undefined => {
  if (!response) return undefined;
  try {
    return response.snxAccounts.map((snxAccount: SnxAccount) => {
      return mapResponseToSnxAccount(snxAccount);
    });
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

////////////////////////////////////////////////////////////////
//////////////////////    MARKET    ////////////////////////////
////////////////////////////////////////////////////////////////

export const mapSingleMarketToInterface = (response: MarketSg): Market | undefined => {
  if (!response) return undefined;
  if (response.marketName === '' || response.marketSymbol === '') return undefined;
  try {
    return {
      id: response.id ?? '',
      marketName: response.marketName ?? '',
      marketSymbol: response.marketSymbol ?? '',
      feedId: response.feedId ?? '',
      marketPrice: response.marketPrice ?? '0',
      size: response.size ?? '0',
      skew: response.skew ?? '0',
      maxOpenInterest: response.maxOpenInterest ?? '0',
      maxMarketValue: response.maxMarketValue ?? '0',
      interestRate: response.interestRate ?? '0',
      currentFundingRate: response.currentFundingRate ?? '0',
      currentFundingVelocity: response.currentFundingVelocity ?? '0',
      indexPrice: response.indexPrice ?? '0',
      skewScale: response.skewScale ?? '0',
      maxFundingVelocity: response.maxFundingVelocity ?? '0',
      makerFee: response.makerFee ?? '0',
      takerFee: response.takerFee ?? '0',
      initialMarginRatioD18: response.initialMarginRatioD18 ?? '0',
      minimumPositionMargin: response.minimumPositionMargin ?? '0',
      maintenanceMarginRatioD18: response.maintenanceMarginRatioD18 ?? '0',
      minimumInitialMarginRatioD18: response.minimumInitialMarginRatioD18 ?? '0',
    };
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

export const mapMarketsArrayToInterface = (response: MarketSg[]): (Market | undefined)[] | undefined => {
  if (!response) return undefined;
  try {
    return response.map((market: MarketSg) => {
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

export const mapResponseToOrder = (response: any): Order | undefined => {
  if (!response) return undefined;
  try {
    return {
      id: response.id,
      market: mapSingleMarketToInterface(response.market),
      snxAccountId: response.snxAccount.id,
      isLimitOrder: response.isLimitOrder,
      acceptablePrice: response.acceptablePrice,
      commitmentTime: response.commitmentTime,
      expectedPriceTime: response.expectedPriceTime,
      settlementTime: response.settlementTime,
      expirationTime: response.expirationTime,
      trackingCode: response.trackingCode,
      deltaSize: response.deltaSize,
      deltaSizeUsd: response.deltaSizeUsd,
      executionPrice: response.executionPrice,
      collectedFees: response.collectedFees,
      settlementReward: response.settlementReward,
      referralFees: response.referralFees,
      partnerAddress: response.partnerAddress,
      txHash: response.txHash,
      createdTimestamp: response.createdTimestamp,
      status: response.status,
      settledTxHash: response.settledTxHash,
      settledTimestamp: response.settledTimestamp,
      settledTimestampISO: response.settledTimestampISO,
      settledBy: mapResponseToWallet(response.settledBy),
    };
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

export const mapResponseToOrderArray = (response: any): Order[] | undefined => {
  if (!response) return undefined;
  try {
    return response.orders.map((order: Order) => {
      return mapResponseToOrder(order);
    });
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

////////////////////////////////////////////////////////////////
////////////////////    Collaterals   //////////////////////////
////////////////////////////////////////////////////////////////

function mapResponseToCollateralDeposit(response: any): CollateralDeposit | undefined {
  return {
    id: response.id,
    snxAccountId: response.snxAccountId,
    collateralId: response.collateralId,
    collateralName: response.collateralName,
    collateralSymbol: response.collateralSymbol,
    collateralDecimals: response.collateralDecimals,
    collateralAddress: response.collateralAddress,
    currentDepositedAmount: response.currentDepositedAmount,
    totalAmountDeposited: response.totalAmountDeposited,
    totalAmountWithdrawn: response.totalAmountWithdrawn,
    totalAmountLiquidated: response.totalAmountLiquidated,
  };
}

export const mapResponseToCollateralDepositArray = (response: any): CollateralDeposit[] | undefined => {
  if (!response) return undefined;
  try {
    return response.collateralDeposits.map((deposit: CollateralDeposit) => {
      return mapResponseToCollateralDeposit(deposit);
    });
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

export const mapOrderArrayToPriceid = (response: any) => {
  if (!response) return undefined;
  try {
    return response.orders.map((order: Order) => {
      return {
        priceIds: order.market?.feedId,
      };
    });
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

////////////////////////////////////////////////////////////////
//////////////////////    POSITION    //////////////////////////
////////////////////////////////////////////////////////////////

export const mapResponseToPosition = (response: any): Position | undefined => {
  if (!response) return undefined;
  try {
    return {
      id: response.id,
      market: mapSingleMarketToInterface(response.market),
      snxAccountId: response.snxAccountId,
      isLong: response.isLong,
      positionSize: response.positionSize,
      avgPrice: response.avgPrice,
      avgPriceDec: response.avgPriceDec,
      status: response.status,
      txHash: response.txHash,
      liquidationTxHash: response.liquidationTxHash,
      closingPrice: response.closingPrice,
      realizedPnl: response.realizedPnl,
      realizedFee: response.realizedFee,
      netRealizedPnl: response.netRealizedPnl,
      createdTimestamp: response.createdTimestamp,
      lastRefresh: response.lastRefresh,
      lastRefreshISO: response.lastRefreshISO,
      accruedBorrowingFees: response.accruedBorrowingFees,
      canBeLiquidated: response.canBeLiquidated,
    };
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};

export const mapResponseToPositionArray = (response: any): Position[] | undefined => {
  if (!response) return undefined;

  try {
    return response.positions.map((position: any) => {
      return mapResponseToPosition(position);
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
  if (!response) return undefined;

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
  if (!response) return undefined;

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
  if (!response) return undefined;

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

export const mapSingleDepoistCollateral = (collateralDepositsResponse: any): DepositCollateral | undefined => {
  if (collateralDepositsResponse === null) return undefined;
  try {
    return {
      id: collateralDepositsResponse.id,
      depositedAmount: collateralDepositsResponse.depositedAmount,
      collateralName: collateralDepositsResponse.collateralName,
      collateralSymbol: collateralDepositsResponse.collateralSymbol,
      collateralDecimals:
        collateralDepositsResponse.collateralDecimals !== '0' ? collateralDepositsResponse.collateralDecimals : '18',
      collateralAddress: collateralDepositsResponse.collateralAddress,
      formattedDepositedAmount: formatUnits(
        collateralDepositsResponse.depositedAmount,
        collateralDepositsResponse.collateralDecimals !== '0'
          ? Number(collateralDepositsResponse.collateralDecimals)
          : 18, // Ensuring `collateralDecimals` is a number
      ),
      snxAccount: {
        id: collateralDepositsResponse?.snxAccount?.id,
        accountId: collateralDepositsResponse?.snxAccount?.accountId,
      },
    };
  } catch (error) {
    console.log('Error while mapping data', error);
    throw error;
  }
};
