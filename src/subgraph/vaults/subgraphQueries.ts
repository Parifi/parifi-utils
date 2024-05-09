import { gql } from 'graphql-request';

// Currently only two vaults exists, and in the future the vaults will be limited to
// prevent liquidity fragmentation. Hence, the query avoids passing the count and skip filters
// and returns all the available vaults
export const fetchAllVaultsQuery = () => gql`
  {
    vaults(first: 100) {
      id
      vaultName
      vaultSymbol
      vaultDecimals
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
      isPaused
      feeManagerAddress
      totalAssets
      totalShares
      assetsPerShare
      assetsPerShareDec
      sharesPerAsset
      withdrawalFee
      profitFromTraderLosses
      lossFromTraderProfits
      cooldownPeriod
      withdrawalWindow
    }
  }
`;

export const fetchUserVaultPositionsQuery = (user: string) => gql`
{
  vaultPositions(
    first: 1000
    orderBy: sharesBalance
    orderDirection: desc
    where: {user: "${user}"}
  ) {
    id
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
    totalMinted
    totalRedeemed
    totalDeposited
    totalWithdrawn
    avgMintPrice
    avgMintPriceDec
    realizedPNL
    realizedPNLInUsd
    unrealizedPNL
    timestamp
    cooldownInitiatedTimestamp
    cooldownEnd
    withdrawalEnds
  }
}
`;

export const fetchVaultAprDetails = (vaultId: string) => gql`
  {
    vaultDailyDatas(
      first: 30
      orderBy: startTimestamp
      orderDirection: desc
      where: { vault: "${vaultId}" }
    ) {
    	vault { allTimeApr }
      apr
    }
  }
`;

export const fetchCooldownDetails = (user: string) => gql`
{
  vaultCooldowns(
    orderBy: timestamp
    orderDirection: desc
    first: 10
    where: {user: "${user}"}
  ) {
    id
    user {
      id
    }
    vault {
      id
      vaultName
      vaultSymbol
      cooldownPeriod
      withdrawalWindow
    }
    timestamp
    cooldownEnd
    withdrawalEnds
    amountAssets
  }
}
`;
