import { gql } from 'graphql-request';

// The `fetchRealizedPnlData` query fetches the realized PnL for a user address
// for vaults and positions
export const fetchRealizedPnlData = (userAddress: string) => gql`
  {
    account(id: "${userAddress.toLowerCase()}") {
      id
      totalRealizedPnlPositions
      totalRealizedPnlVaults
    }
  }
`;

/// Fetch Portfolio total for a set of addresses
/// Portfolio total consists of
/// 1. Realized PNL from positions and vaults - user.totalRealizedPnlPositions, user.totalRealizedPnlVaults
/// 2. Unrealized PNL from positions - positions.netUnrealizedPnlInUsd
/// 3. Deposited liquidity in vaults -
/// 4. Deposited collateral of all open positions - positions.positionCollateral
export const fetchPortfolioData = (userAddresses: string[]) => gql`
{
  accounts(where: {id_in: [${userAddresses.map((id) => `"${id.toLowerCase()}"`).join(', ')}]}) {
    id
    totalRealizedPnlPositions
    totalRealizedPnlVaults
  }
  positions(
    first: 1000
    orderBy: positionCollateral
    orderDirection: desc
    where: {
      user_in: [${userAddresses.map((id) => `"${id.toLowerCase()}"`).join(', ')}], 
      status: OPEN
      }
  ) {
    id
    user {
      id
    }
    netUnrealizedPnlInUsd
    positionCollateral
    market {
      depositToken {
        decimals
        pyth {
          id
          price
        }
      }
    }
  }
  vaultPositions(
    first: 1000
    orderBy: sharesBalance
    orderDirection: desc
    where: {user_in: [${userAddresses.map((id) => `"${id.toLowerCase()}"`).join(', ')}]}
  ) {
    user {
      id
    }
    vault {
      id
      assetsPerShare
      sharesPerAsset
      depositToken {
        decimals
        pyth {
          id
          price
        }
      }
    }
    sharesBalance
  }
}
`;

export const fetchReferralRewardsInUsd = (userAddresses: string[]) => gql`
{
  accounts(
    orderBy: referralRewardsInUsd
    orderDirection: desc
    where: {id_in: [${userAddresses.map((id) => `"${id}"`).join(', ')}]}
  ) {
    id
    referralRewardsInUsd
  }
}`;

export const fetchTopAccountsByReferralFees = (count: number = 20, skip: number = 0) => gql`
{
  accounts(
    first: ${count}
    skip: ${skip}
    orderBy: referralRewardsInUsd
    orderDirection: desc
  ) {
    id
    referralRewardsInUsd
  }
}`;
