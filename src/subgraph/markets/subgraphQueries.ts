import { gql } from 'graphql-request';

// The `fetchAllMarketsData` query fetches all market data for the first 100 markets
export const fetchAllMarketsDataQuery = gql`
  {
    markets(first: 80) {
      id
      marketName
      marketSymbol
      size
      skew
      currentFundingRate
      currentFundingVelocity
      feedId
      maxFundingVelocity
      skewScale
      makerFee
      takerFee
    }
  }
`;

// Fetch all details of a market by ID
export const fetchMarketByIdQuery = (marketId: string) => gql`
  {
    market(id: "${marketId.toLowerCase()}") {
   id
   marketName
   marketSymbol
   size
   skew
   currentFundingRate
   currentFundingVelocity
   feedId
   maxFundingVelocity
   skewScale
   makerFee
   takerFee
    }
  }
`;
