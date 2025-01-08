import { ParifiSdk } from '../../src';
import { gql } from 'graphql-request';
import { configDotenv } from 'dotenv';
import { getParifiSdkInstanceForTesting } from '..';
import Decimal from 'decimal.js';
configDotenv();

describe('Perp off-chain calculations', () => {
  let parifiSdk: ParifiSdk;
  const sizeLong = 1.5; // 1.5 eth
  const sizeShort = -1.5; // 1.5 eth
  const avgPrice = 3000; // 3000 usd

  beforeAll(async () => {
    parifiSdk = await getParifiSdkInstanceForTesting();
  });

  it('should return correct pnl for short position in loss', async () => {
    const marketPrice = 3500; //
    // As marketPrice is greater than avgPrice of a short position,
    // total loss = (3500 - 3000) * (-1.5) = -750 usd
    const pnl = parifiSdk.perps.getProfitOrLossInUsd(marketPrice, avgPrice, sizeShort);
    const expectedPnl = new Decimal(-750);
    console.log(`Calculated pnl: ${pnl} \nExpected pnl: ${expectedPnl}`);
    expect(pnl).toEqual(expectedPnl);
  });

  it('should return correct pnl for short position in profit', async () => {
    const marketPrice = 2800; //
    // As marketPrice is greater than avgPrice of a short position,
    // total profit = (2800 - 3000) * (-1.5) = (-200 * -1.5)= 300 usd
    const pnl = parifiSdk.perps.getProfitOrLossInUsd(marketPrice, avgPrice, sizeShort);

    const expectedPnl = new Decimal(300);
    console.log(`Calculated pnl: ${pnl} \nExpected pnl: ${expectedPnl}`);
    expect(pnl).toEqual(expectedPnl);
  });

  it('should return correct pnl for Long position in profit', async () => {
    const marketPrice = 3050; //
    // As marketPrice is greater than avgPrice of a long position,
    // total profit = (3050 - 3000) * (1.5) = 75 usd
    const pnl = parifiSdk.perps.getProfitOrLossInUsd(marketPrice, avgPrice, sizeLong);

    const expectedPnl = new Decimal(75);
    console.log(`Calculated pnl: ${pnl} \nExpected pnl: ${expectedPnl}`);
    expect(pnl).toEqual(expectedPnl);
  });

  it('should return correct pnl for Long position in loss', async () => {
    const marketPrice = 2575; //
    // As marketPrice is greater than avgPrice of a short position,
    // total loss = (2575 - 3000) * (1.5) = -425 * 1.5 = -637.5 usd
    const pnl = parifiSdk.perps.getProfitOrLossInUsd(marketPrice, avgPrice, sizeLong);

    const expectedPnl = new Decimal(-637.5);
    console.log(`Calculated pnl: ${pnl} \nExpected pnl: ${expectedPnl}`);
    expect(pnl).toEqual(expectedPnl);
  });
});
