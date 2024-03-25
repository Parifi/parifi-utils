import { gql } from 'graphql-request';

// The `fetchRealizedPnlData` query fetches the realized PnL for a user address
// for vaults and positions
export const fetchRealizedPnlData = (userAddress: string) => gql`
  {
    account(id: "${userAddress}") {
      id
      totalRealizedPnlPositions
      totalRealizedPnlVaults
    }
  }
`;
