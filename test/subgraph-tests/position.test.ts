import { Chain } from '@parifi/references';
import { ParifiSdk } from '../../src';
import { RpcConfig } from '../../src/interfaces/classConfigs';

const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_SEPOLIA,
};

const parifiSdk = new ParifiSdk(rpcConfig, {}, {}, {});

describe('Order fetching logic from subgraph', () => {
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
});
