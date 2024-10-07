// import { getParifiSdkInstanceForTesting } from '..';
// import { ethers } from 'ethers';
// import { BIGINT_ZERO } from '../../src';

describe('Stats tests', () => {
//   it('should return pool data for a user with deposits', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();

//     const userWithDeposits = '0xc1f0bece556740a73f125ea147e50df2563e1930';
//     const userPoolData = await parifiSdk.core.getPoolPageData(userWithDeposits);
//     expect(userPoolData.length).not.toBe(0);
//     userPoolData.forEach((data) => {
//       expect(Number(data.assetBalance.toString())).not.toBe(0);
//     });
//   });

//   it('should return pool data for a user with no deposits', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();

//     const userPoolData = await parifiSdk.core.getPoolPageData(ethers.ZeroAddress);
//     expect(userPoolData.length).not.toBe(0);
//     userPoolData.forEach((data) => {
//       expect(Number(data.assetBalance.toString())).toBe(0);
//     });
//   });
it('should liquidate a single position', async () => {
  console.log("hello from order mangaer")
 })
});
