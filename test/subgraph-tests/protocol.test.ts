import { getParifiSdkInstanceForTesting } from '..';
import { status, TEST_POSITION_ID1, TEST_USER_ADDRESS, TEST_USER_ADDRESS_CLOSED_POS } from '../common/constants';

describe('Order fetching logic from subgraph', () => {
  it('should return position details by status: CLOSED', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const protocolData = await parifiSdk.subgraph.getProtocolTradeInformtaion();
    console.log("protocol data",protocolData)
  });

});
