import { Chain } from '@parifi/references';
import { ParifiSdk, PythConfig, RelayerConfig, RelayerI, RpcConfig, SubgraphConfig } from '../../src';

const chain = Chain.ARBITRUM_MAINNET;
const rpcConfig: RpcConfig = {
  chainId: chain,
};

const pythConfig: PythConfig = {
  pythEndpoint: process.env.PYTH_SERVICE_ENDPOINT,
  username: process.env.PYTH_SERVICE_USERNAME,
  password: process.env.PYTH_SERVICE_PASSWORD,
  isStable: true,
};

const parifiConfig: RelayerI = {
  jwtToken: process.env.PARIFI_RELAYER_JWT_TOKEN || '',
  // relayerEndpoint: 'http://localhost:3001',
};

const relayerConfig: RelayerConfig = {
  parifiRealyerConfig: parifiConfig,
};

const subgraphConfig: SubgraphConfig = {
  subgraphEndpoint: process.env.SUBGRAPH_ENDPOINT,
};

const parifiSdk = new ParifiSdk(rpcConfig, subgraphConfig, relayerConfig, pythConfig);

describe('ParifiSdk parifi relayer', () => {
  it.skip('should return txId', async () => {
    const txId = await parifiSdk.relayer.parifi.executeTx({
      to: '0x15758472aF37950028ad27e4a7F99e65A4A997Cc',
      data: '0x095ea7b30000000000000000000000003232f21a6e08312654270c78a773f00dd61d60f500000000000000000000000000000000000000000000000000000000000003e8',
      value: '0',
    });
    console.log('=== txId', txId);
    expect(txId).toBeTruthy();
  });
});
