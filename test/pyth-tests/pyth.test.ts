import 'dotenv/config';
import { Chain } from '../../src';
import { getPythClient, getVaaPriceUpdateData } from '../../src/pyth';

const chain = Chain.ARBITRUM_SEPOLIA;

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
});
