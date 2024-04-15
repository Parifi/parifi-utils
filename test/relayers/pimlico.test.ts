import { getParifiSdkInstanceForTesting } from '..';

describe.skip('Pimlico test cases', () => {
  it('should initialize Pimlico and send a sample tx', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const targetContractAddress = '0x58d24685a6982CbEE9d43f3e915B4A6EA12bB3c6';
    const txData = '0x123456789';
    const { txHash } = await parifiSdk.relayer.pimlico.executeTxUsingPimlico(targetContractAddress, txData);

    console.log(`User operation included: https://arbiscan.io/tx/${txHash}`);
  });
});
