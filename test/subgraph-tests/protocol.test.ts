import { getParifiSdkInstanceForTesting } from '..';
import { TEST_MARKET_ID1 } from '../common/constants';

describe('Protocol data', () => {
  it('should return correct execution fee', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const res = await parifiSdk.subgraph.getExecutionFee();
    console.log(res);
  });
});
