import { getParifiSdkInstanceForTesting } from '..';
import { TEST_USER_ID1, TEST_USER_ID2, TEST_USER_ID3 } from '../common/constants';

describe('Order fetching logic from subgraph', () => {
  it('should return PNL details for a user', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    // Use an address with a non-zero positions/deposits
    const userAddress = '0xe4fDB1Fa65b29533D6d3D9Aa74e07E6e87405B32';

    const { totalRealizedPnlPositions, totalRealizedPnlVaults } =
      await parifiSdk.subgraph.getRealizedPnlForUser(userAddress);

    console.log('totalRealizedPnlPositions', totalRealizedPnlPositions);
    console.log('totalRealizedPnlVaults', totalRealizedPnlVaults);

    const unrealizedPNL = await parifiSdk.subgraph.getTotalUnrealizedPnlInUsd(userAddress);
    console.log('unrealizedPNL', unrealizedPNL);
  });

  it('should return Portfolio total for user addresses', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    // Use addresses with a non-zero positions/deposits
    const userAddresses = [TEST_USER_ID1, TEST_USER_ID2, TEST_USER_ID3];

    const { portfolioData } = await parifiSdk.subgraph.getPortfolioDataForUsers(userAddresses);
    expect(portfolioData.length).not.toBe(0);
  });

  it('should return referral earnings', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    // Use addresses with a non-zero referral rewards
    const userAddresses = [TEST_USER_ID1, '0x58d24685a6982cbee9d43f3e915b4a6ea12bb3c6', TEST_USER_ID3];

    const referralRewards = await parifiSdk.subgraph.getReferralRewardsInUsd(userAddresses);
    expect(referralRewards.length).not.toBe(0);
  });

  it('should return top accounts referral earnings sorted by referral earnings', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const referralRewards = await parifiSdk.subgraph.getTopAccountsByReferralRewards();
    expect(referralRewards.length).not.toBe(0);
    // If we have two accounts with referral rewards, 1st account should have equal or more than the second account
    if (referralRewards.length > 1) {
      expect(referralRewards[0].referralRewardsInUsd.toNumber()).toBeGreaterThanOrEqual(
        referralRewards[1].referralRewardsInUsd.toNumber(),
      );
    }
  });
});
