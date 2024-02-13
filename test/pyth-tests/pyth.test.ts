import 'dotenv/config';
import { Chain } from '@parifi/references';
import { getPythClient, getVaaPriceUpdateData } from '../../src/pyth';
import { ParifiSdk } from '../../src';
import { RpcConfig } from '../../src/types';

const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_SEPOLIA,
};

const parifiSdk = new ParifiSdk(rpcConfig, {}, {}, {});

describe('Pyth tests', () => {
  it('should return price update data from public endpoint', async () => {
    const ethPriceIdStable = '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace';

    const pythClient = await getPythClient();
    if (pythClient) {
      const priceUpdateData = await getVaaPriceUpdateData([ethPriceIdStable], pythClient);
      console.log(priceUpdateData);
      expect(priceUpdateData).not.toBeNull();
    } else {
      fail;
    }
  });

  it('should return price update data from dedicated endpoint with authentication', async () => {
    const ethPriceIdStable = '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace';

    const pythClient = await getPythClient(
      process.env.PYTH_SERVICE_ENDPOINT,
      process.env.PYTH_SERVICE_USERNAME,
      process.env.PYTH_SERVICE_PASSWORD,
      true,
    );
    if (pythClient) {
      const priceUpdateData = await getVaaPriceUpdateData([ethPriceIdStable], pythClient);
      console.log(priceUpdateData);
      expect(priceUpdateData).not.toBeNull();
    } else {
      fail;
    }
  });

  it('should return price ids from subgraph', async () => {
    const orderIds = [
      '0xb160ae39e7a45b21fb8f247fb11f551f996ed90d3eb9a6263e49b98827e1fc4b',
      '0xbd8bdf1ed20ac4a074c0c6ccc49e1716b80cb734ed75b53668c15956c2bba494',
    ];

    const priceIds: string[] = await parifiSdk.subgraph.getPythPriceIdsForOrderIds(orderIds);
    console.log('priceIds from fn: ', priceIds);

    expect(priceIds.length).toBeGreaterThan(0);
  });
});
