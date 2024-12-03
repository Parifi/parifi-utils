import { getParifiSdkInstanceForTesting } from '..';
import { status, TEST_POSITION_ID1, TEST_USER_ADDRESS, TEST_USER_ADDRESS_CLOSED_POS } from '../common/constants';

describe('Order fetching logic from subgraph', () => {
  it('should return correct user position details', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const userAddress = TEST_USER_ADDRESS;
    const orderData = await parifiSdk.subgraph.getOpenPositionsByUserAddress(userAddress, 100, 0);
    expect(orderData[0]?.user?.id).toBe(userAddress);
  });

  it('should return position details by status: CLOSED', async () => {
    const positionId = TEST_POSITION_ID1;
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const position = await parifiSdk.subgraph.getPositionById(positionId);
    expect(position.id).toBe(positionId);
    expect(position.status).toBe(status.CLOSED);
  });

  it('should return position details by User address', async () => {
    const userAddress = TEST_USER_ADDRESS_CLOSED_POS;
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const position = await parifiSdk.subgraph.getClosedPositionsByUserAddress(userAddress);
    expect(position[0]?.user?.id).toBe(userAddress);
  });
  

  it('should return position details by User address', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const position = await parifiSdk.subgraph.getLiqudationPosition('10316853981992787796');
    console.log(position)
  });
  it('should return All Open position', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const position = await parifiSdk.subgraph.getAllOpenPositionsAndAccountInfo(20,20);
    console.log('OPEN POSITIONS',position)
  });
  it('should return All Open position based on time ' , async () => {
    const startTime = '1730612233'
    const endTime = '1731217033'
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const position = await parifiSdk.subgraph.getAllOpenPositionWithTime(startTime,endTime)
    // console.log(`All open position between startTime ${startTime} and endTime ${endTime}`,position)
  });
  it('should return All Closed position based on time ' , async () => {
    const startTime = '1730612233'
    const endTime = '1731217033'
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const position = await parifiSdk.subgraph.getAllClosedAndLiquidatedPosition(startTime,endTime);
    // console.log(`All Closed position based on time ${startTime} end time ${endTime}`,position)
  });
});
