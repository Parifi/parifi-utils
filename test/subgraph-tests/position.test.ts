import 'dotenv/config';
import { Chain } from '@parifi/references';
import { ParifiSdk } from '../../src';
import { PythConfig, RelayerConfig, RelayerI, RpcConfig, SubgraphConfig } from '../../src/interfaces/classConfigs';

const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_SEPOLIA,
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
  apiKey: process.env.GELATO_KEY,
};

const relayerConfig: RelayerConfig = {
  gelatoConfig: gelatoConfig,
};

const parifiSdk = new ParifiSdk(rpcConfig, subgraphConfig, relayerConfig, pythConfig);

describe('Order fetching logic from subgraph', () => {
  it('should return correct position details', async () => {
    await parifiSdk.init();
    const positionId = '0x08df72fc01f549908150f60f64bd5eb4228fa755d420bd28d3ec2f2957a543f2';

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

    const positionIds = ['0x08df72fc01f549908150f60f64bd5eb4228fa755d420bd28d3ec2f2957a543f2'];

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

    const taskId = await parifiSdk.core.batchLiquidatePositionsUsingGelato(positionIds);
    console.log('Task ID: ', taskId);
  });

  it('should return valid total collateral deposited value from all user positions', async () => {
    await parifiSdk.init();

    /// Add an address that has active positions
    const userAddress = '0xd60202464e7d923dea9c2b2f5435597e51de2683';
    const userPositions = await parifiSdk.subgraph.getAllPositionsByUserAddress(userAddress);
    if (userPositions.length > 0) {
      const totalCollateralValueInUsd = await parifiSdk.subgraph.getTotalDepositedCollateralInUsd(userAddress);
      expect(totalCollateralValueInUsd.toNumber()).toBeGreaterThan(0);
    }
  });

  it('should return valid total unrealized PNL from all user positions', async () => {
    await parifiSdk.init();

    /// Add an address that has active positions
    const userAddress = '0xd60202464e7d923dea9c2b2f5435597e51de2683';
    const userPositions = await parifiSdk.subgraph.getAllPositionsByUserAddress(userAddress);
    if (userPositions.length > 0) {
      const totalNetUnrealizedPnlInUsd = await parifiSdk.subgraph.getTotalUnrealizedPnlInUsd(userAddress);
      console.log('totalNetUnrealizedPnlInUsd', totalNetUnrealizedPnlInUsd);
      if (totalNetUnrealizedPnlInUsd.isPositive()) {
        expect(totalNetUnrealizedPnlInUsd.toNumber()).toBeGreaterThan(0);
      } else {
        expect(totalNetUnrealizedPnlInUsd.toNumber()).toBeLessThan(0);
      }
    }
  });
});
