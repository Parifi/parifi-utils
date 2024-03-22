import 'dotenv/config';
import { Chain } from '@parifi/references';
import { ParifiSdk } from '../../src';
import { PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from '../../src/interfaces/classConfigs';

const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_SEPOLIA,
};

const subgraphConfig: SubgraphConfig = {
  subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/sudeepb02/parifi-testnet',
};

const pythConfig: PythConfig = {
  pythEndpoint: process.env.PYTH_SERVICE_ENDPOINT,
  username: process.env.PYTH_SERVICE_USERNAME,
  password: process.env.PYTH_SERVICE_PASSWORD,
  isStable: true,
};

const relayerConfig: RelayerConfig = {
  gelatoConfig: {
    apiKey: process.env.GELATO_KEY,
  },
};

const parifiSdk = new ParifiSdk(rpcConfig, subgraphConfig, relayerConfig, pythConfig);

describe('Order fetching logic from subgraph', () => {
  it('should return correct position details', async () => {
    await parifiSdk.init();
    const positionId = '0x5c46fe7154af223da5e2e6d284e367d4ef38bdfd5c6fd4ce56cc47d0d3cbd957';

    const position = await parifiSdk.subgraph.getPositionById(positionId);
    console.log(positionId);
    expect(position.id).toBe(positionId);
  });

  it('should return position details by status: OPEN', async () => {
    await parifiSdk.init();

    const userAddress = '0x552AF4aF77b514E0DD1FB5B40A868e7dcE3fD794';
    const positions = await parifiSdk.subgraph.getOpenPositionsByUserAddress(userAddress);
    console.log(positions.length);
    if (positions.length > 0) {
      expect(positions[0].status).toBe('OPEN');
    }
  });

  it('should return position details by status: CLOSED', async () => {
    await parifiSdk.init();

    const userAddress = '0x552AF4aF77b514E0DD1FB5B40A868e7dcE3fD794';
    const positions = await parifiSdk.subgraph.getClosedPositionsByUserAddress(userAddress);
    console.log(positions.length);
    if (positions.length > 0) {
      expect(positions[0].status).toBe('CLOSED');
    }
  });

  it('should return position details by status: LIQUIDATED', async () => {
    await parifiSdk.init();

    const userAddress = '0x552AF4aF77b514E0DD1FB5B40A868e7dcE3fD794';
    const positions = await parifiSdk.subgraph.getLiquidatedPositionsByUserAddress(userAddress);
    console.log(positions.length);
    if (positions.length > 0) {
      expect(positions[0].status).toBe('LIQUIDATED');
    }
  });

  it('should return price ids for position ids', async () => {
    await parifiSdk.init();

    const positionIds = [
      '0x00119fbaf9bcb7af16173ca7db01c90d53bd96c4eb2810f2b982bd3e1a36fab0',
      '0x00450423fe9218d87b44919528e7cd75fb86c31af0ba0e7e7d3547e019d4adb4',
      '0x00841110ab1304773ceb680ae39dcd0a50d3326a50de33aab6792d17a4483b04',
    ];

    const priceIds = await parifiSdk.subgraph.getPythPriceIdsForPositionIds(positionIds);
    expect(priceIds.length).toBeGreaterThan(0);
  });

  it('should return position ids available for liquidation', async () => {
    await parifiSdk.init();

    const positionsToRefresh = await parifiSdk.subgraph.getPositionsToRefresh();
    console.log('positionsToRefresh', positionsToRefresh);

    // Get upto 5 positions to liquidate
    const positionIds = await parifiSdk.subgraph.getPositionsToLiquidate(5);
    console.log('positionIds', positionIds);
    if (positionIds.length == 0) return;

    // Get unique price ids for the above positions
    const priceIds = await parifiSdk.subgraph.getPythPriceIdsForPositionIds(positionIds);
    console.log('priceIds', priceIds);
    expect(priceIds.length).toBeGreaterThan(0);

    console.log('gelato', process.env.GELATO_KEY);
    const taskId = await parifiSdk.core.batchLiquidatePositionsUsingGelato(positionIds);
    console.log('Task ID: ', taskId);
  });
});
