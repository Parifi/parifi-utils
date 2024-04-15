import { getParifiSdkInstanceForTesting } from '..';
import { TEST_USER_ID1, TEST_VAULT_ID1 } from '../common/constants';

describe('Vault fetching logic from subgraph', () => {
  it('should return correct vault details', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const vaults = await parifiSdk.subgraph.getAllVaults();
    console.log('vaults', vaults);

    expect(vaults.length).not.toBe(0);
  });

  it('should return correct Total Pool Value', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const data = await parifiSdk.subgraph.getTotalPoolsValue();
    console.log(data);

    expect(data.totalPoolValue).not.toBe(0);
  });

  it('should return correct user vault data', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const data = await parifiSdk.subgraph.getUserVaultDataByChain(TEST_USER_ID1);
    console.log(data);

    expect(data.length).not.toBe(0);
  });

  it('should return correct user total pools vaule', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const data = await parifiSdk.subgraph.getUserTotalPoolsValue(TEST_USER_ID1);
    console.log(data);

    expect(data.myTotalPoolValue).not.toBe(0);
  });

  it('should return correct APR details', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const vaultId = TEST_VAULT_ID1;
    const data = await parifiSdk.subgraph.getVaultApr(vaultId);
    console.log(data);
  });
});
