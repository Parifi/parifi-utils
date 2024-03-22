import 'dotenv/config';
import { Chain } from '@parifi/references';
import { PythConfig, RelayerConfig, RelayerI, RpcConfig, SubgraphConfig } from '../../src/interfaces/classConfigs';
import { ParifiSdk } from '../../src';

const chain = Chain.ARBITRUM_SEPOLIA;
const rpcConfig: RpcConfig = {
  chainId: chain,
};

const subgraphConfig: SubgraphConfig = {
  subgraphEndpoint: process.env.SUBGRAPH_ENDPOINT,
};

const pythConfig: PythConfig = {
  pythEndpoint: process.env.PYTH_SERVICE_ENDPOINT,
  username: process.env.PYTH_SERVICE_USERNAME,
  password: process.env.PYTH_SERVICE_PASSWORD,
  isStable: true,
};

const gelatoConfig: RelayerI = {
  apiKey: process.env.GELATO_KEY || '',
};

const relayerConfig: RelayerConfig = {
  gelatoConfig: gelatoConfig,
};

const parifiSdk = new ParifiSdk(rpcConfig, subgraphConfig, relayerConfig, pythConfig);
//
// gelato say too many requests
describe.skip('Order Manager tests', () => {
  it('should liquidate a single position', async () => {
    await parifiSdk.init();

    let positionId: string;
    const positionsToLiquidate = await parifiSdk.subgraph.getPositionsToLiquidate();
    console.log('positionsToLiquidate', positionsToLiquidate);

    // Get the first position id to liquidate
    if (positionsToLiquidate.length > 0) {
      positionId = positionsToLiquidate[0];

      const { gelatoTaskId } = await parifiSdk.core.liquidatePositionUsingGelato(positionId);
      console.log('taskId', gelatoTaskId);

      const taskStatus = await parifiSdk.gelato.checkGelatoTaskStatus(gelatoTaskId);
      console.log('taskStatus', taskStatus);
    }
  });
});
