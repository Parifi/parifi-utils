import { ParifiSdk } from '../../src';
import { gql } from 'graphql-request';
import { configDotenv } from 'dotenv';
import { getParifiSdkInstanceForTesting } from '..';
import Decimal from 'decimal.js';
configDotenv();

describe('check Pnl value', () => {
  let parifiSdk: ParifiSdk | undefined = undefined;
  beforeAll(async () => {
    parifiSdk = await getParifiSdkInstanceForTesting();
  });
  it('should return right pnl for short position', async () => {
    if (!parifiSdk) throw new Error('Parifi SDK not initialized');
    const {totalProfitOrLoss} =  parifiSdk.perps.getProfitOrLossInUsd(new Decimal(1150), new Decimal(1190000000000000000000), new Decimal(-5000000000000000000), 18);
    expect(totalProfitOrLoss).toEqual(new Decimal(200))
  });
  it('should return right pnl for short position', async () => {
    if (!parifiSdk) throw new Error('Parifi SDK not initialized');
    const {totalProfitOrLoss} =  parifiSdk.perps.getProfitOrLossInUsd(new Decimal(1250), new Decimal(1190000000000000000000), new Decimal(5000000000000000000), 18);
    expect(totalProfitOrLoss).toEqual(new Decimal(300))
  });
});
