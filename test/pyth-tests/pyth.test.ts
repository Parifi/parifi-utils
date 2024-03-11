import 'dotenv/config';
import { Chain } from '@parifi/references';
// import { getPythClient, getVaaPriceUpdateData } from '../../src/pyth';
import { ParifiSdk } from '../../src';
import { GelatoConfig, PythConfig, RpcConfig } from '../../src/interfaces/classConfigs';

const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_SEPOLIA,
};

const pythConfig: PythConfig = {
  pythEndpoint: process.env.PYTH_SERVICE_ENDPOINT,
  username: process.env.PYTH_SERVICE_USERNAME,
  password: process.env.PYTH_SERVICE_PASSWORD,
  isStable: true,
};

const gelatoConfig: GelatoConfig = {
  apiKey: process.env.GELO_API_KEY || '',
};

const parifiSdk = new ParifiSdk(rpcConfig, {}, {}, pythConfig, gelatoConfig);

describe('Pyth tests', () => {
  it('should return price update data from public endpoint', async () => {
    await parifiSdk.init();
    const ethPriceIdStable = '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace';

    // SDK is initialized without any fields for Pyth config, so public endpoints are used
    const sdkWithPublicPyth = new ParifiSdk(rpcConfig, {}, {}, {}, gelatoConfig);
    await sdkWithPublicPyth.init();

    const priceUpdateData = await sdkWithPublicPyth.pyth.getVaaPriceUpdateData([ethPriceIdStable]);
    console.log(priceUpdateData);
    expect(priceUpdateData).not.toBeNull();
  });

  it('should return price update data from dedicated endpoint with authentication', async () => {
    await parifiSdk.init();
    const ethPriceIdStable = '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace';

    // Parifi SDK uses authentication using the above Pyth config
    const priceUpdateData = await parifiSdk.pyth.getVaaPriceUpdateData([ethPriceIdStable]);

    console.log(priceUpdateData);
    expect(priceUpdateData).not.toBeNull();
  });

  it('should return price ids from subgraph', async () => {
    await parifiSdk.init();
    const orderIds = [
      '0xb160ae39e7a45b21fb8f247fb11f551f996ed90d3eb9a6263e49b98827e1fc4b',
      '0xbd8bdf1ed20ac4a074c0c6ccc49e1716b80cb734ed75b53668c15956c2bba494',
    ];

    const priceIds: string[] = await parifiSdk.subgraph.getPythPriceIdsForOrderIds(orderIds);
    console.log('priceIds from fn: ', priceIds);

    expect(priceIds.length).toBeGreaterThan(0);
  });
});
