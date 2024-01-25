import { Account, Market, Order, Position, PriceFeedSnapshot, PythData } from "./types";
import { Token } from "./types";

////////////////////////////////////////////////////////////////
//////////////////////    ACCOUNT   ////////////////////////////
////////////////////////////////////////////////////////////////

export const mapSubgraphResponseToAccountInterface = (response: any): Account => {
    return {
        id: response.id,
        totalOrdersCount: response.totalOrdersCount,
        openPositionsCount: response.openPositionsCount,
        totalPositionsCount: response.totalPositionsCount,
        referralFeesInUsd: response.referralFeesInUsd,
    };
};

////////////////////////////////////////////////////////////////
//////////////////////    MARKET    ////////////////////////////
////////////////////////////////////////////////////////////////

export const mapSingleMarketToInterface = (response: any): Market => {
    return {
        id: response.id,
        vaultAddress: response.vaultAddress,
        depositToken: response.depositToken, // You might need a separate mapping function for Token
        isLive: response.isLive,
        marketDecimals: response.marketDecimals,
        liquidationThreshold: response.liquidationThreshold,
        minCollateral: response.minCollateral,
        maxLeverage: response.maxLeverage,
        openingFee: response.openingFee,
        closingFee: response.closingFee,
        liquidationFee: response.liquidationFee,
        maxPriceDeviation: response.maxPriceDeviation,
        createdTimestamp: response.createdTimestamp,
        lastUpdated: response.lastUpdated,
        maxOpenInterest: response.maxOpenInterest,
        totalLongs: response.totalLongs,
        avgPriceLongs: response.avgPriceLongs,
        pnlLongs: response.pnlLongs,
        totalShorts: response.totalShorts,
        avgPriceShorts: response.avgPriceShorts,
        pnlShorts: response.pnlShorts,
        netPnl: response.netPnl,
        netPnlDec: response.netPnlDec,
        totalOI: response.totalOI,
        totalOIAssets: response.totalOIAssets,
        closeOnlyMode: response.closeOnlyMode,
        feeLastUpdatedTimestamp: response.feeLastUpdatedTimestamp,
        priceDeviationLongs: response.priceDeviationLongs,
        priceDeviationShorts: response.priceDeviationShorts,
        utilizationLongs: response.utilizationLongs,
        utilizationShorts: response.utilizationShorts,
        marketSkew: response.marketSkew,
        baseFeeCumulativeLongs: response.baseFeeCumulativeLongs,
        baseFeeCumulativeShorts: response.baseFeeCumulativeShorts,
        dynamicFeeCumulativeLongs: response.dynamicFeeCumulativeLongs,
        dynamicFeeCumulativeShorts: response.dynamicFeeCumulativeShorts,
        deviationCoeff: response.deviationCoeff,
        deviationConst: response.deviationConst,
        baseCoeff: response.baseCoeff,
        baseConst: response.baseConst,
        maxDynamicBorrowFee: response.maxDynamicBorrowFee,
        dynamicCoeff: response.dynamicCoeff,
        transactionHash: response.transactionHash,
        senderAddress: response.senderAddress,
        pyth: response.pyth
    }   
}

export const mapMarketsArrayMarketInterface = (response: any): Market[] => {
    return response.markets.map((market:Market) => {
        return mapSingleMarketToInterface(market)
    })
};


////////////////////////////////////////////////////////////////
//////////////////////    ORDERS    ////////////////////////////
////////////////////////////////////////////////////////////////

export const mapSubgraphResponseToOrderInterface = (response: any): Order => {
    return {
        id: response.id,
        market: response.market ? mapSingleMarketToInterface(response.market) : undefined,
        user: response.user ? mapSubgraphResponseToAccountInterface(response.user) : undefined,
        orderType: response.orderType,
        isLong: response.isLong,
        isLimitOrder: response.isLimitOrder,
        triggerAbove: response.triggerAbove,
        deadline: response.deadline,
        deltaCollateral: response.deltaCollateral,
        deltaSize: response.deltaSize,
        expectedPrice: response.expectedPrice,
        maxSlippage: response.maxSlippage,
        partnerAddress: response.partnerAddress,
        executionFee: response.executionFee,
        txHash: response.txHash,
        createdTimestamp: response.createdTimestamp,
        status: response.status,
        settledTxHash: response.settledTxHash,
        settledTimestamp: response.settledTimestamp,
        executionPrice: response.executionPrice,
        settledBy: response.settledBy,
        cancellationTxHash: response.cancellationTxHash,
        positionId: response.positionId,
    };
};

////////////////////////////////////////////////////////////////
//////////////////////    POSITION    //////////////////////////
////////////////////////////////////////////////////////////////

export const mapSubgraphResponseToPositionInterface = (response: any): Position => {
    return {
        id: response.id,
        market: response.market ? mapSingleMarketToInterface(response.market) : undefined,
        user: response.user ? mapSubgraphResponseToAccountInterface(response.user) : undefined,
        isLong: response.isLong,
        positionCollateral: response.positionCollateral,
        positionSize: response.positionSize,
        avgPrice: response.avgPrice,
        avgPriceDec: response.avgPriceDec,
        avgPricePrev: response.avgPricePrev,
        lastCumulativeFee: response.lastCumulativeFee,
        status: response.status,
        txHash: response.txHash,
        liquidationTxHash: response.liquidationTxHash,
        closingPrice: response.closingPrice,
        realizedPnl: response.realizedPnl,
        realizedPnlCollateral: response.realizedPnlCollateral,
        realizedFee: response.realizedFee,
        realizedFeeCollateral: response.realizedFeeCollateral,
        netRealizedPnl: response.netRealizedPnl,
        createdTimestamp: response.createdTimestamp,
        lastRefresh: response.lastRefresh,
    };
};


////////////////////////////////////////////////////////////////
//////////////////////    TOKEN    /////////////////////////////
////////////////////////////////////////////////////////////////

export const mapSubgraphResponseToTokenInterface = (response: any): Token => {
    return {
        id: response.id,
        name: response.name,
        symbol: response.symbol,
        decimals: response.decimals,
        pyth: response.pyth ? mapSubgraphResponseToPythDataInterface(response.pyth) : undefined,
        lastPriceUSD: response.lastPriceUSD,
        lastPriceTimestamp: response.lastPriceTimestamp,
    };
};


////////////////////////////////////////////////////////////////
////////////////////////    PYTH    ////////////////////////////
////////////////////////////////////////////////////////////////

export const mapSubgraphResponseToPriceFeedSnapshotInterface = (response: any): PriceFeedSnapshot => {
    return {
        id: response.id,
        priceId: response.priceId,
        publishTime: response.publishTime,
        price: response.price,
        confidence: response.confidence,
    };
};

export const mapSubgraphResponseToPythDataInterface = (response: any): PythData => {
    return {
        id: response.id,
        marketId: response.marketId,
        tokenAddress: response.tokenAddress,
        price: response.price,
        lastUpdatedTimestamp: response.lastUpdatedTimestamp,
    };
};