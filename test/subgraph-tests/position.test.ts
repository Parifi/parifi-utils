import { getParifiSdkInstanceForTesting } from '..';
import { status, TEST_POSITION_ID1, TEST_USER_ADDRESS, TEST_USER_ADDRESS_CLOSED_POS } from '../common/constants';

describe('Position fetching logic from subgraph', () => {
  it('should return all positions for a user Address', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const userAddress = '0x2f22928335ed7e472c18e1e487593c0ac40e9ca8';
    const positionData = await parifiSdk.subgraph.getAllPositionsByUserAddress(userAddress, 3, 0);
    // console.log('Positions data: ', JSON.stringify(positionData));
    expect(positionData.length).not.toBe(0);
  });
});
