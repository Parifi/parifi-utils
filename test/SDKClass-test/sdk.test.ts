import 'dotenv/config';
import { Chain } from '@parifi/references';
import { ParifiSdk } from '../../src';
import { GelatoConfig, PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from '../../src/interfaces/classConfigs';

const chain = Chain.ARBITRUM_SEPOLIA;
const rpcConfig: RpcConfig = {
  chainId: chain,
};

const pythConfig: PythConfig = {
  pythEndpoint: process.env.PYTH_SERVICE_ENDPOINT,
  username: process.env.PYTH_SERVICE_USERNAME,
  password: process.env.PYTH_SERVICE_PASSWORD,
  isStable: true,
};

const relayerConfig: RelayerConfig = {};
const subgraphConfig: SubgraphConfig = {};

const gelatoConfig: GelatoConfig = {
  apiKey: process.env.GELO_API_KEY || '',
};

const parifiSdk = new ParifiSdk(rpcConfig, subgraphConfig, relayerConfig, pythConfig, gelatoConfig);

describe('sdkTest', () => {
  it('should return correct position details', async () => {
    await parifiSdk.init();
    const positionId = '0x5c46fe7154af223da5e2e6d284e367d4ef38bdfd5c6fd4ce56cc47d0d3cbd957';

    const position = await parifiSdk.subgraph.getPositionById(positionId);

    console.log(positionId);
    if (position) {
      expect(position.id).toBe(positionId);
    } else {
      fail;
    }
  });
});

describe('Pyth tests', () => {
  it('should return price update data from public endpoint', async () => {
    await parifiSdk.init();
    const ethPriceIdStable = '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace';

    const priceUpdateData = await parifiSdk.pyth.getVaaPriceUpdateData([ethPriceIdStable]);
    if (priceUpdateData) {
      console.log(priceUpdateData);
      expect(priceUpdateData).not.toBeNull();
    } else {
      fail;
    }
  });
});
