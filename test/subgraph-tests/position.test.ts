import { getParifiSdkInstanceForTesting } from '..';
import { TEST_POSITION_ID1, TEST_POSITION_ID2, TEST_USER_ID2 } from '../common/constants';
// import { PositionStatus } from '../../src';
// import {
//   TEST_POSITION_ID1,
//   TEST_POSITION_ID2,
//   TEST_POSITION_ID3,
//   TEST_USER_ID1,
//   TEST_USER_ID2,
//   TEST_USER_ID3,
//   TEST_USER_ID4,
// } from '../common/constants';

describe('Order fetching logic from subgraph', () => {
  it('should return correct position details', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const positionId = TEST_POSITION_ID1;

    const position = await parifiSdk.subgraph.getPositionById(positionId);
    console.log(positionId);
    expect(position.id).toBe(positionId);
    expect(position.status).toBe('OPEN');
  });

  // it('should return position details by status: OPEN', async () => {
  //   const parifiSdk = await getParifiSdkInstanceForTesting();

  //   const userAddress = TEST_POSITION_ID1;
  //   const positions = await parifiSdk.subgraph.getOpenPositionsByUserAddress(userAddress);
  //   console.log(positions.length);
  //   if (positions.length > 0) {
  //     expect(positions[0].status).toBe('OPEN');
  //   }
  // });

  it('should return position details by status: CLOSED', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const positionId = TEST_POSITION_ID2;
    const positions = await parifiSdk.subgraph.getPositionById(positionId);
      expect(positions.status).toBe('CLOSED');
    }
  );

//   it('should return position details by status: LIQUIDATED', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();

//     const userAddress = TEST_USER_ID3;
//     const positions = await parifiSdk.subgraph.getLiquidatedPositionsByUserAddress(userAddress);
//     console.log(positions.length);
//     if (positions.length > 0) {
//       expect(positions[0].status).toBe('LIQUIDATED');
//     }
//   });

//   it('should return price ids for position ids', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();

//     const positionIds = [TEST_POSITION_ID1, TEST_POSITION_ID2, TEST_POSITION_ID3];

//     const priceIds = await parifiSdk.subgraph.getPythPriceIdsForPositionIds(positionIds);
//     expect(priceIds.length).toBeGreaterThan(0);
//   });

//   it('should return position ids available for liquidation', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();

//     const positionsToRefresh = await parifiSdk.subgraph.getPositionsToRefresh();
//     console.log('positionsToRefresh', positionsToRefresh);

//     // Get upto 5 positions to liquidate
//     const positionIds = await parifiSdk.subgraph.getPositionsToLiquidate(5);
//     console.log('positionIds', positionIds);
//     if (positionIds.length == 0) {
//       console.log('No positions available for liquidation');
//       return;
//     }

//     // Get unique price ids for the above positions
//     const priceIds = await parifiSdk.subgraph.getPythPriceIdsForPositionIds(positionIds);
//     console.log('priceIds', priceIds);
//     expect(priceIds.length).toBeGreaterThan(0);

//     const taskId = await parifiSdk.core.batchLiquidatePositionsUsingGelato(positionIds);
//     console.log('Task ID: ', taskId);
//   });

//   it('should return valid total collateral deposited value from all user positions', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();

//     /// Add an address that has active positions
//     const userAddress = TEST_USER_ID1;
//     const userPositions = await parifiSdk.subgraph.getOpenPositionsByUserAddress(userAddress);
//     if (userPositions.length > 0) {
//       const totalCollateralValueInUsd = await parifiSdk.subgraph.getTotalDepositedCollateralInUsd(userAddress);
//       expect(totalCollateralValueInUsd.toNumber()).toBeGreaterThan(0);
//     } else {
//       console.log('No open positions found for user address');
//     }
//   });

//   it('should return valid total unrealized PNL from all user positions', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();

//     /// Add an address that has active positions
//     const userAddress = TEST_USER_ID1;
//     const userPositions = await parifiSdk.subgraph.getOpenPositionsByUserAddress(userAddress);
//     if (userPositions.length > 0) {
//       const totalNetUnrealizedPnlInUsd = await parifiSdk.subgraph.getTotalUnrealizedPnlInUsd(userAddress);
//       console.log('totalNetUnrealizedPnlInUsd', totalNetUnrealizedPnlInUsd);
//       if (totalNetUnrealizedPnlInUsd.isPositive()) {
//         expect(totalNetUnrealizedPnlInUsd.toNumber()).toBeGreaterThan(0);
//       } else {
//         expect(totalNetUnrealizedPnlInUsd.toNumber()).toBeLessThan(0);
//       }
//     } else {
//       console.log('No open positions found for user address');
//     }
//   });

//   it('should return all orders related to a position id', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();

//     const orders = await parifiSdk.subgraph.getAllOrdersForPosition(TEST_POSITION_ID1);
//     console.log('Orders for position ID:', orders);
//   });

//   it('should return position history for a user', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();

//     const userAddress = TEST_USER_ID2;
//     const positions = await parifiSdk.subgraph.getPositionsHistory(userAddress);
//     console.log(positions.length);
//     positions.forEach((position) => {
//       expect(position.status).not.toBe(PositionStatus.OPEN);
//     });
//   });
});
