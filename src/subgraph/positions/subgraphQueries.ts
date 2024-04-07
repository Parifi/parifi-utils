import { gql } from 'graphql-request';

// Fetches all positions by a user (Both open and closed)
export const fetchPositionsByUserQuery = (userAddress: string, count: number = 10, skip: number = 0) =>
  gql`
    {
        positions(
            first: ${count}
            skip: ${skip}
            orderBy: createdTimestamp
            orderDirection: desc
            where: {user: "${userAddress}"}
        ) {
            id
            market {
            id
            }
            user {
            id
            }
            positionSize
            positionCollateral
            avgPrice
            avgPriceDec
            isLong
            createdTimestamp
            lastCumulativeFee
            status
            txHash
            liquidationTxHash
            closingPrice
            realizedPnl
            realizedPnlCollateral
            realizedFee
            realizedFeeCollateral
            netRealizedPnl
            createdTimestamp
            lastRefresh
            lastRefreshISO
        }
    }`;

// Fetches positions for a user address by status
export const fetchPositionsByUserQueryAndStatus = (
  userAddress: string,
  status: string,
  count: number = 10,
  skip: number = 0,
) =>
  gql`
    {
        positions(
            first: ${count}
            skip: ${skip}
            orderBy: createdTimestamp
            orderDirection: desc
            where: {
                user: "${userAddress}"
                status: "${status}"
                }
        ) {
            id
            market {
            id
            }
            user {
            id
            }
            positionSize
            positionCollateral
            avgPrice
            avgPriceDec
            isLong
            createdTimestamp
            lastCumulativeFee
            status
            txHash
            liquidationTxHash
            closingPrice
            realizedPnl
            realizedPnlCollateral
            realizedFee
            realizedFeeCollateral
            netRealizedPnl
            createdTimestamp
            lastRefresh
            lastRefreshISO
        }
    }`;

export const fetchPositionByIdQuery = (positionId: string) =>
  gql`
    {
        position(
            id: "${positionId}"
        ) {
            id
            market {
                id
            }
            user {
                id
            }
            isLong
            positionCollateral
            positionSize
            avgPrice
            avgPriceDec
            lastCumulativeFee
            status
            txHash
            liquidationTxHash
            closingPrice
            realizedPnl
            realizedPnlCollateral
            realizedFee
            realizedFeeCollateral
            netRealizedPnl
            createdTimestamp
            lastRefresh
            lastRefreshISO            
        }
    }`;

export const fetchPriceIdsFromPositionIdsQuery = (positionIds: string[]) =>
  gql`
  {
    positions (
      where: {
        id_in: [${positionIds.map((id) => `"${id}"`).join(', ')}]
      }
    ) {
      id
      market {
        pyth {
          id
        }
      }
    }
  }
`;

export const fetchPositionsToRefreshQuery = (count: number) => gql`
  {
    positions(where: { status: OPEN }, first: ${count}, orderBy: lastRefresh, orderDirection: asc) {
      id
    }
  }
`;

export const fetchPositionsToLiquidateQuery = (count: number) => gql`
  {
    positions(where: { status: OPEN, canBeLiquidated: true }, first: ${count}, orderBy: positionSize, orderDirection: desc) {
      id
    }
  }
`;

// Fetches the collateral related data for all positions of a `userAddress`
export const fetchAllPositionsForCollateralData = (userAddress: string) => gql`
  {
    positions(
      first: 1000
      orderBy: positionCollateral
      orderDirection: desc
      where: { user: "${userAddress}", status: OPEN }
    ) {
      id
      positionCollateral
      market {
        depositToken {
          decimals
          pyth {
            price
          }
        }
      }
    }
  }
`;

// Fetches the unrealized PNL for all positions of a `userAddress`
export const fetchAllPositionsUnrealizedPnl = (userAddress: string) => gql`
  {
    positions(
      first: 1000
      orderBy: positionCollateral
      orderDirection: desc
      where: { user: "${userAddress}", status: OPEN }
    ) {
      id
      netUnrealizedPnlInUsd
    }
  }
`;

// Fetches the unrealized PNL for all positions of a `userAddress`
export const fetchAllPositionsMultiUserUnrealizedPnl = (userAddresses: string[]) => gql`
  {
    positions(
      first: 1000
      orderBy: positionCollateral
      orderDirection: desc
      where: { user_in: ${userAddresses.map((address: string) => `"${address.trim()}"`)}, status: OPEN }
    ) {
      id
      netUnrealizedPnlInUsd
      user {
        id
      }
    }
  }
`;
