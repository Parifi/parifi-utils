import { getParifiSdkInstanceForTesting } from '..';
import { status, TEST_POSITION_ID1, TEST_USER_ADDRESS, TEST_USER_ADDRESS_CLOSED_POS } from '../common/constants';

describe('Protocol stats', () => {
  it('should return protocol stats data', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const protocolData = await parifiSdk.subgraph.getProtocolStats();
    console.log('Protocol stats: ', protocolData);
  });
});
