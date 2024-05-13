import { getParifiSdkInstanceForTesting } from '..';
import { TEST_USER_ID1, TEST_VAULT_ID1 } from '../common/constants';

describe('Vault fetching logic from subgraph', () => {
  it('should return correct vault details', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const vaults = await parifiSdk.subgraph.getAllVaults();
    expect(vaults.length).not.toBe(0);
  });
  it('should return correct Total Pool Value', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const totalPoolsValue = await parifiSdk.subgraph.getTotalPoolsValue();
    console.log(totalPoolsValue);
    expect(totalPoolsValue).not.toBe(0);
  });

  it('should return correct user vault data', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const data = await parifiSdk.subgraph.getUserVaultData(TEST_USER_ID1);
    expect(data.length).not.toBe(0);
  });

  it('should return correct user total pools vaule', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const userTotalPoolsValue = await parifiSdk.subgraph.getUserTotalPoolsValue(TEST_USER_ID1);
    console.log(userTotalPoolsValue);
    expect(userTotalPoolsValue).not.toBe(0);
  });

  it('should return correct APR details', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const vaultId = TEST_VAULT_ID1;
    const data = await parifiSdk.subgraph.getVaultApr(vaultId);
    console.log(data);
  });

  it('should return Vault cooldown details', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const vaultCooldowns = await parifiSdk.subgraph.getUserVaultCoolDowns(TEST_USER_ID1);
    expect(vaultCooldowns.length).not.toBe(0);
  });
});
