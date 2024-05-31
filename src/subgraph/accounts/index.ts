import Decimal from 'decimal.js';
import { request } from 'graphql-request';
import {
  fetchPortfolioData,
  fetchRealizedPnlData,
  fetchReferralRewardsInUsd,
  fetchTopAccountsByReferralFees,
} from './subgraphQueries';
import { DECIMAL_ZERO, PRICE_FEED_PRECISION } from '../../common';
import { ReferralRewardsInUsd, UserPortfolioData } from '../../interfaces/sdkTypes';
import { mapAccountsArrayToInterface } from '../../common/subgraphMapper';

/// Returns the Realized PNL for positions and vaults for a user address
export const getRealizedPnlForUser = async (
  subgraphEndpoint: string,
  userAddress: string,
): Promise<{
  totalRealizedPnlPositions: Decimal;
  totalRealizedPnlVaults: Decimal;
}> => {
  try {
    // Interface to map fetched data
    interface RealizedPnlSubgraphResponse {
      account: {
        id: string;
        totalRealizedPnlPositions: string;
        totalRealizedPnlVaults: string;
      };
    }

    const query = fetchRealizedPnlData(userAddress);
    const subgraphResponse: RealizedPnlSubgraphResponse = await request(subgraphEndpoint, query);

    const totalRealizedPnlPositions = new Decimal(subgraphResponse.account.totalRealizedPnlPositions);
    const totalRealizedPnlVaults = new Decimal(subgraphResponse.account.totalRealizedPnlVaults);

    return { totalRealizedPnlPositions, totalRealizedPnlVaults };
  } catch (error) {
    throw error;
  }
};

/// Returns the current USD value of user portfolio data
export const getPortfolioDataForUsers = async (
  subgraphEndpoint: string,
  userAddresses: string[],
): Promise<{
  portfolioData: UserPortfolioData[];
}> => {
  try {
    // Interface to map fetched data
    interface PortfolioDataResponse {
      accounts: {
        id: string;
        totalRealizedPnlPositions: string;
        totalRealizedPnlVaults: string;
      }[];
      positions: {
        id: string;
        user: {
          id: string;
        };
        netUnrealizedPnlInUsd: string;
        positionCollateral: string;
        market: {
          depositToken: {
            decimals: string;
            pyth: {
              id: string;
              price: string;
            };
          };
        };
      }[];
      vaultPositions: {
        user: {
          id: string;
        };
        vault: {
          id: string;
          assetsPerShare: string;
          sharesPerAsset: string;
          depositToken: {
            decimals: string;
            pyth: {
              id: string;
              price: string;
            };
          };
        };
        sharesBalance: string;
      }[];
    }

    /// Dictionary to store the final result of data
    const finalResult: Record<string, UserPortfolioData> = {};

    const formattedAddresses = userAddresses.map((userAddress) => userAddress.toLowerCase());
    const query = fetchPortfolioData(formattedAddresses);
    const subgraphResponse = await request(subgraphEndpoint, query);
    const mappedRes: PortfolioDataResponse = subgraphResponse as unknown as PortfolioDataResponse;

    /// Iterate through the returned data to calculate final values
    const accountsArray = mappedRes.accounts;
    const positionsArray = mappedRes.positions;
    const vaultPositionsArray = mappedRes.vaultPositions;

    accountsArray.map((account) => {
      const user = account.id;
      if (finalResult[user] === undefined) {
        finalResult[user] = {
          userAddress: user,
          realizedPnl: DECIMAL_ZERO,
          unrealizedPnl: DECIMAL_ZERO,
          depositedLiquidity: DECIMAL_ZERO,
          depositedCollateral: DECIMAL_ZERO,
        };
      }

      // Realized PNL is realized PNL from Vaults and Positions
      finalResult[user].realizedPnl = new Decimal(account.totalRealizedPnlPositions).add(
        new Decimal(account.totalRealizedPnlVaults),
      );
    });

    positionsArray.map((position) => {
      const user = position.user.id;
      // Unrealized PNL from positions is the sum of all unrealized PNL from Positions
      finalResult[user].unrealizedPnl = finalResult[user].unrealizedPnl.add(
        new Decimal(position.netUnrealizedPnlInUsd),
      );

      // Deposited collateral from positions in USD
      // The collateral value returned from subgraph needs to be converted to USD
      const positionCollateral = new Decimal(position.positionCollateral);
      const pythPrice = new Decimal(position.market.depositToken.pyth.price);
      const tokenDecimalsFactor = new Decimal(10).pow(position.market.depositToken.decimals);

      const amountUsd: Decimal = positionCollateral.times(pythPrice).div(tokenDecimalsFactor).div(PRICE_FEED_PRECISION);

      finalResult[user].depositedCollateral = finalResult[user].depositedCollateral.add(amountUsd);
    });

    vaultPositionsArray.map((vaultPosition) => {
      // User wallet address
      const user = vaultPosition.user.id;

      // Convert deposited liquidity amount to USD
      const sharesBalance = new Decimal(vaultPosition.sharesBalance);
      const tokenDecimalsFactor = new Decimal(10).pow(vaultPosition.vault.depositToken.decimals);
      const pythPrice = new Decimal(vaultPosition.vault.depositToken.pyth.price).div(PRICE_FEED_PRECISION);

      const amountUsd: Decimal = sharesBalance
        .mul(new Decimal(vaultPosition.vault.assetsPerShare))
        .mul(pythPrice)
        .div(tokenDecimalsFactor)
        .div(tokenDecimalsFactor);

      finalResult[user].depositedLiquidity = finalResult[user].depositedLiquidity.add(amountUsd);
    });

    const portfolioData: UserPortfolioData[] = [];
    accountsArray.forEach((account) => {
      portfolioData.push(finalResult[account.id]);
    });

    return { portfolioData };
  } catch (error) {
    throw error;
  }
};

// Returns the referral reward earned by wallet addresses in USD
export const getReferralRewardsInUsd = async (
  subgraphEndpoint: string,
  userAddresses: string[],
): Promise<ReferralRewardsInUsd[]> => {
  const subgraphResponse = await request(subgraphEndpoint, fetchReferralRewardsInUsd(userAddresses));
  const accountsData = mapAccountsArrayToInterface(subgraphResponse);

  const referralRewardsInUsd: ReferralRewardsInUsd[] = [];

  if (accountsData) {
    accountsData.forEach((account) => {
      referralRewardsInUsd.push({
        userAddress: account.id ?? '0x',
        totalReferralRewardsInUsd: new Decimal(account.totalReferralRewardsInUsd ?? 0),
        unclaimedReferralRewardsUsdc: BigInt(account.unclaimedReferralRewardsUsdc ?? 0),
        unclaimedReferralRewardsWeth: BigInt(account.unclaimedReferralRewardsWeth ?? 0),
      });
    });
  }
  return referralRewardsInUsd;
};

// Returns the top addresses by referral rewards earned in USD
export const getTopAccountsByReferralRewards = async (
  subgraphEndpoint: string,
  count: number = 20,
  skip: number = 0,
): Promise<ReferralRewardsInUsd[]> => {
  const subgraphResponse = await request(subgraphEndpoint, fetchTopAccountsByReferralFees(count, skip));
  const accountsData = mapAccountsArrayToInterface(subgraphResponse);

  const referralRewardsInUsd: ReferralRewardsInUsd[] = [];

  if (accountsData) {
    accountsData.forEach((account) => {
      referralRewardsInUsd.push({
        userAddress: account.id ?? '0x',
        totalReferralRewardsInUsd: new Decimal(account.totalReferralRewardsInUsd ?? 0),
        unclaimedReferralRewardsUsdc: BigInt(account.unclaimedReferralRewardsUsdc ?? 0),
        unclaimedReferralRewardsWeth: BigInt(account.unclaimedReferralRewardsWeth ?? 0),
      });
    });
  }
  return referralRewardsInUsd;
};
