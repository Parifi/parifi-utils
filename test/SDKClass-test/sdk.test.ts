import 'dotenv/config';
import { Chain, SDK } from '../../src';
import { PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from '../../src/types';

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

const relayrConfig: RelayerConfig = {};
const subgraphConfig: SubgraphConfig = {};

const Sdk = new SDK(rpcConfig, subgraphConfig, relayrConfig, pythConfig);

describe('sdkTest', () => {
  it('should return correct position details', async () => {
    console.log('Test running successfully');
    const positionId = '0x5c46fe7154af223da5e2e6d284e367d4ef38bdfd5c6fd4ce56cc47d0d3cbd957';

    const position = await Sdk.subgraph.getPositionById(positionId);

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
    const ethPriceIdStable = '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace';

    const priceUpdateData = await Sdk.pyth.getVaaPriceUpdateData([ethPriceIdStable]);
    if (priceUpdateData) {
      console.log(priceUpdateData);
      expect(priceUpdateData).not.toBeNull();
    } else {
      fail;
    }
  });
});
