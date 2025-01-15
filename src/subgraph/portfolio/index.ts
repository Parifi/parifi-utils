import { CollateralDeposit, Position, PriceObject } from '../../interfaces';
import { DECIMAL_ZERO } from '../../common';
import Decimal from 'decimal.js';
import { getAllPositionsByUserAddress } from '../positions';
import { calculateUnrealizedPnlForPositions, calculateUsdValueOfCollateralDeposits } from '../../perps/offchain';

export const getPortfolioStats = async (
  subgraphEndpoint: string,
  userAddress: string,
  priceData: { id: string; price: number }[],
): Promise<{
  collateralValueInUsd: Decimal;
  unrealizedPnl: Decimal;
  realizedPnl: Decimal;
}> => {
  // Note: Fetching all positions (open, closed and liquidated) is required
  // to account for collateralDeposits in SNX accounts without active positions
  const snxAccountPositionData = await getAllPositionsByUserAddress(subgraphEndpoint, userAddress, 100);

  let collateralDeposits: CollateralDeposit[] = [];
  let positionsArray: Position[] = [];
  let realizedPnl = DECIMAL_ZERO;

  snxAccountPositionData.forEach((snxAccount) => {
    // 1. Populate CollateralDeposits array for all snxAccounts by the user address
    if (snxAccount.collateralDeposits) {
      collateralDeposits = collateralDeposits.concat(snxAccount.collateralDeposits);
    }

    // 2. Add all unrealized pnl values for all snxAccounts by the user address
    // @todo

    // 3.Populate Positions array for all snxAccounts
    if (snxAccount.positions) {
      positionsArray = positionsArray.concat(snxAccount.positions);
    }
  });

  // Use open positions to calculate unrealized pnl
  const { openPositions, otherPositions } = splitPositionsByStatus(positionsArray);
  const unrealizedPnl = calculateUnrealizedPnlForPositions(openPositions, priceData);
  const collateralValueInUsd = calculateUsdValueOfCollateralDeposits(collateralDeposits, priceData);

  return {
    collateralValueInUsd,
    unrealizedPnl,
    realizedPnl,
  };
};

const splitPositionsByStatus = (positions: Position[]): { openPositions: Position[]; otherPositions: Position[] } => {
  const openPositions: Position[] = [];
  const otherPositions: Position[] = [];

  positions.forEach((position) => {
    if (position.status === 'OPEN') {
      openPositions.push(position);
    } else {
      otherPositions.push(position);
    }
  });

  return { openPositions, otherPositions };
};

export function transformPriceArray(priceArray: PriceObject[]): { id: string; price: number }[] {
  return priceArray.map((obj) => ({
    id: obj.id,
    price: Number(obj.price.price) / 10 ** Math.abs(obj.price.expo),
  }));
}
