import { getParifiSdkInstanceForTesting } from '..';
import { TEST_USER_ID1 } from '../common/constants';

describe('Order fetching logic from subgraph', () => {

it('should return correct account', async () => {
  const parifiSdk = await getParifiSdkInstanceForTesting();
  const order = await parifiSdk.subgraph.getUserByAddress(TEST_USER_ID1);
  expect(order.id).toBe(TEST_USER_ID1);
});

});
