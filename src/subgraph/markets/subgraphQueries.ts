import { gql } from 'graphql-request';

// The `fetchAllMarketsData` query fetches all market data for the first 100 markets
export const fetchAllMarketsDataQuery = gql`
  {
    markets {
      id
      marketName
      marketSymbol
      marketPrice
      feedId
      skew
      size
      maxOpenInterest
      maxMarketValue
      interestRate
      currentFundingRate
      currentFundingVelocity
      indexPrice
      skewScale
      maxFundingVelocity
      makerFee
      takerFee
      marketPrice
      initialMarginRatioD18
      minimumPositionMargin
      maintenanceMarginRatioD18
      minimumInitialMarginRatioD18
    }
  }
`;

// Fetch all details of a market by ID
export const fetchMarketByIdQuery = (marketId: string) => gql`
  {
    market(id: "${marketId}") {
    id
    marketName
    marketSymbol
    marketPrice
    feedId
    skew
    size
    maxOpenInterest
    maxMarketValue
    interestRate
    currentFundingRate
    currentFundingVelocity
    indexPrice
    skewScale
    maxFundingVelocity
    makerFee
    takerFee
    marketPrice
    initialMarginRatioD18
  	minimumPositionMargin
    maintenanceMarginRatioD18
    minimumInitialMarginRatioD18
    }
  }
`;
