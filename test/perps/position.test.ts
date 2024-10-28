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
    const {totalProfitOrLoss} =  parifiSdk.perps.getProfitOrLossInUsd(1150, 1190000000000000000000, -5000000000000000000, 18);
    expect(totalProfitOrLoss).toEqual(new Decimal(200))
  });
  it('should return right pnl for Long position', async () => {
    if (!parifiSdk) throw new Error('Parifi SDK not initialized');
    const {totalProfitOrLoss} =  parifiSdk.perps.getProfitOrLossInUsd(1250, 1190000000000000000000, 5000000000000000000, 18);
    expect(totalProfitOrLoss).toEqual(new Decimal(300))
  });
  it('should return right pnl for Long position', async () => {
    if (!parifiSdk) throw new Error('Parifi SDK not initialized');
    const {totalProfitOrLoss} =  parifiSdk.perps.getProfitOrLossInUsd(1150, 1190000000000000000000, 5000000000000000000, 18);
    expect(totalProfitOrLoss).toEqual(new Decimal(-200))
  });
  it('should return right pnl for Long position', async () => {
    if (!parifiSdk) throw new Error('Parifi SDK not initialized');
    const {totalProfitOrLoss} =  parifiSdk.perps.getProfitOrLossInUsd(1250, 1190000000000000000000, -5000000000000000000, 18);
    expect(totalProfitOrLoss).toEqual(new Decimal(-300))
  });
});
