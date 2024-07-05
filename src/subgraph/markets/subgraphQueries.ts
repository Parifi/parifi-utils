import { gql } from 'graphql-request';

// The `fetchAllMarketsData` query fetches all market data for the first 100 markets
export const fetchAllMarketsDataQuery = gql`
  {
    markets(first: 100) {
      id
      name
      vaultAddress
      depositToken {
        id
        name
        symbol
        decimals
        lastPriceUSD
        lastPriceTimestamp
        pyth {
          id
        }
      }
      isLive
      marketDecimals
      liquidationThreshold
      minCollateral
      maxLeverage
      openingFee
      closingFee
      liquidationFee
      maxPriceDeviation
      createdTimestamp
      lastUpdated
      maxOpenInterest
      totalLongs
      avgPriceLongs
      pnlLongs
      totalShorts
      avgPriceShorts
      pnlShorts
      netPnl
      netPnlDec
      totalOI
      totalOIAssets
      closeOnlyMode
      feeLastUpdatedTimestamp
      priceDeviationLongs
      priceDeviationShorts
      utilizationLongs
      utilizationShorts
      marketSkew
      baseFeeCumulativeLongs
      baseFeeCumulativeShorts
      dynamicFeeCumulativeLongs
      dynamicFeeCumulativeShorts
      deviationCoeff
      deviationConst
      baseCoeff
      baseConst
      maxDynamicBorrowFee
      dynamicCoeff
      transactionHash
      senderAddress
      pyth {
        id
        tokenAddress
        price
        lastUpdatedTimestamp
      }
    }
  }
`;

// Fetch all details of a market by ID
export const fetchMarketByIdQuery = (marketId: string) => gql`
  {
    market(id: "${marketId.toLowerCase()}") {
      id
      name
      vaultAddress
      depositToken {
        id
        name
        symbol
        decimals
        lastPriceUSD
        lastPriceTimestamp
        pyth {
          id
        }
      }
      isLive
      marketDecimals
      liquidationThreshold
      minCollateral
      maxLeverage
      openingFee
      closingFee
      liquidationFee
      maxPriceDeviation
      createdTimestamp
      lastUpdated
      maxOpenInterest
      totalLongs
      avgPriceLongs
      pnlLongs
      totalShorts
      avgPriceShorts
      pnlShorts
      netPnl
      netPnlDec
      totalOI
      totalOIAssets
      closeOnlyMode
      feeLastUpdatedTimestamp
      priceDeviationLongs
      priceDeviationShorts
      utilizationLongs
      utilizationShorts
      marketSkew
      baseFeeCumulativeLongs
      baseFeeCumulativeShorts
      dynamicFeeCumulativeLongs
      dynamicFeeCumulativeShorts
      deviationCoeff
      deviationConst
      baseCoeff
      baseConst
      maxDynamicBorrowFee
      dynamicCoeff
      transactionHash
      senderAddress
      pyth {
        id
        tokenAddress
        price
        lastUpdatedTimestamp
      }
    }
  }
`;
