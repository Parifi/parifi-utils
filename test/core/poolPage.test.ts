import { getParifiSdkInstanceForTesting } from '..';
import { ethers } from 'ethers';
import { BIGINT_ZERO } from '../../src';

describe('Stats tests', () => {
  it('should return pool data for a user with deposits', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const userWithDeposits = '0xD504CeF7dCfdB5b19fA7E207ee2a697c3EAd88D0';
    const userPoolData = await parifiSdk.core.getPoolPageData(userWithDeposits);
    expect(userPoolData.length).not.toBe(0);
    userPoolData.forEach((data) => {
      expect(data.assetBalance).not.toBe(BIGINT_ZERO);
    });
  });

  it('should return pool data for a user with no deposits', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const userPoolData = await parifiSdk.core.getPoolPageData(ethers.ZeroAddress);
    expect(userPoolData.length).not.toBe(0);
    userPoolData.forEach((data) => {
      expect(data.assetBalance).toBe(BIGINT_ZERO);
    });
  });
});
