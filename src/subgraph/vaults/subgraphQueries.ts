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

export const fetchUserAllVaultsQuery = (user: string) => fetchMultiUserAllVaultsQuery([user]);

export const fetchMultiUserAllVaultsQuery = (userAddresses: string[]) => gql`
query vaultInfo {
  vaultPositions(where: {user_in: [${userAddresses.map((address: string) => `"${address.trim()}"`).join(',')}]}) {
    user {
      id
    }
    vault {
      vaultSymbol
      assetsPerShareDec
      assetsPerShare
      id
      cooldownPeriod
      withdrawalWindow
      withdrawalFee
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
      totalAssets
      totalShares
  }
  sharesBalance
  totalMinted
  totalRedeemed
  totalDeposited
  totalWithdrawn
  avgMintPrice
  avgMintPriceDec
  unrealizedPNL
  realizedPNL
  realizedPNLInUsd
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
