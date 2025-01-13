import { getParifiSdkInstanceForTesting } from '..';

describe('Position fetching logic from subgraph', () => {
  it('should return all positions for a user Address', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const userAddress = '0x2f22928335ed7e472c18e1e487593c0ac40e9ca8';
    const positionData = await parifiSdk.subgraph.getAllPositionsByUserAddress(userAddress, 3, 0);
    // console.log('Positions data: ', JSON.stringify(positionData));
    expect(positionData.length).not.toBe(0);
  });

  it('should return positions for a snx account id', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    {
      // It should return position data just with the snx account id
      const snxAccountId = '10209728236255228114';
      const positionData = await parifiSdk.subgraph.getUserPositionsBySnxAccount(snxAccountId);
      expect(positionData?.accountId).toEqual(snxAccountId);
    }

    {
      // It should return position data just with the formatted snx account id
      // e.g PERP-1400686614607063115
      const snxAccountId = 'PERP-1400686614607063115';
      const positionData = await parifiSdk.subgraph.getUserPositionsBySnxAccount(snxAccountId);
      expect(positionData?.id).toEqual(snxAccountId);
    }
  });
});
