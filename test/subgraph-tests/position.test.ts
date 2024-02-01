import { Chain, getPositionById } from '../../src';

const chain = Chain.ARBITRUM_SEPOLIA;

describe('Order fetching logic from subgraph', () => {
  it('should return correct position details', async () => {
    console.log('Test running successfully');
    const positionId = '0x5c46fe7154af223da5e2e6d284e367d4ef38bdfd5c6fd4ce56cc47d0d3cbd957';

    const position = await getPositionById(chain, positionId);

    console.log(positionId);
    if (position) {
      expect(position.id).toBe(positionId);
    } else {
      fail;
    }
  });
});
