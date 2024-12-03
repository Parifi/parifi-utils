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
            where: {user: "${userAddress.toLowerCase()}"}
        ) {
            id
            market {
              id,marketName,marketSymbol,feedId 
            }
            user {
            id
            }
            snxAccount{
              id
              accountId
            }
            positionSize
            positionCollateral
            avgPrice
            avgPriceDec
            isLong
            createdTimestamp
            status
            txHash
            liquidationTxHash
            closingPrice
            realizedPnl
            realizedFee
            netRealizedPnl
            createdTimestamp
            lastRefresh
            lastRefreshISO
            canBeLiquidated
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
                user: "${userAddress.toLowerCase()}"
                status: "${status}"
                }
        ) {
            id
            market {
              id,marketName,marketSymbol,feedId 
            }
            user {
            id
            }
            snxAccount{
              id
              accountId
            }
            positionSize
            positionCollateral
            avgPrice
            avgPriceDec
            isLong
            createdTimestamp
            status
            txHash
            liquidationTxHash
            closingPrice
            realizedPnl
            realizedFee
            netRealizedPnl
            createdTimestamp
            lastRefresh
            lastRefreshISO
            canBeLiquidated
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
              id,marketName,marketSymbol,feedId 
            }
            user {
                id
            }
            snxAccount{
              id
              accountId
            }
            isLong
            positionCollateral
            positionSize
            avgPrice
            avgPriceDec
            status
            txHash
            liquidationTxHash
            closingPrice
            realizedPnl
            realizedFee
            netRealizedPnl
            createdTimestamp
            lastRefresh
            lastRefreshISO
            canBeLiquidated
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
        id,marketName,marketSymbol,feedId 
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
        id,marketName,marketSymbol,feedId 
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
      where: { user: "${userAddress.toLowerCase()}", status: OPEN }
    ) {
      id
      
    }
  }
`;

// Fetches all positions by a user (Both open and closed)
export const fetchPositionHistoryQuery = (userAddress: string, count: number = 100, skip: number = 0) =>
  gql`
    {
        positions(
            first: ${count}
            skip: ${skip}
            orderBy: createdTimestamp
            orderDirection: desc
            where: {user: "${userAddress.toLowerCase()}", status_not: OPEN}
        ) {
            id
            market {
              id,marketName,marketSymbol,feedId 
            }
            user {
            id
            }
            snxAccount{
              id
              accountId
            }
            positionSize
            positionCollateral
            avgPrice
            avgPriceDec
            isLong
            createdTimestamp
            status
            txHash
            liquidationTxHash
            closingPrice
            realizedPnl
            realizedFee
            netRealizedPnl
            createdTimestamp
            lastRefresh
            lastRefreshISO
            canBeLiquidated
            accruedBorrowingFees
        }
    }`;
export const fetchLiquidatePositions = (accountId: string) =>
  gql`
    query {
      wallets(where: { snxAccounts_: { accountId: "${accountId}" } }) {
        id
        positions {
          id
          positionSize
          isLong
          avgPrice
          closingPrice
          status
          market {
            marketSymbol
          }
        }
      }
    }
  `;
export const fetchAllOpenPositionAndAccountInfo = (count: number = 20, skip: number = 0) => gql`
{
  positions(
    orderBy: createdTimestamp
    orderDirection: desc 
    first: ${count}
    skip: ${skip}
    where: { status: OPEN }
  ) {
    id
    market {
      id
    }
    avgPriceDec
    user{
      id
    }
    snxAccount {
      id
      accountId
    }
  }
}`;
export const fetchAllClosedAndLiquidatedPosition = (
  count: number = 20,
  skip: number = 0,
  startTimestamp: string,
  endTimestamp: string,
  statusNot = 'OPEN',
) =>
  gql`
{
      positions(
        first: ${count}
        skip: ${skip}
        where: {
          createdTimestamp_gte: "${startTimestamp}",
          createdTimestamp_lte: "${endTimestamp}",
          status_not: ${statusNot}
        }
      ) {
        id
        user {
          id
        }
        status
        netRealizedPnl
        realizedPnl  # currently using this the netRealizedPnl is zero for liqudated position
      }
    }
  `;
export const fetchAllOpenPosition = (
  count: number = 20,
  skip: number = 0,
  startTimestamp: string,
  endTimestamp: string,
) => gql`
  {
    positions(
      first: ${count}
      skip: ${skip}
      where: {
        createdTimestamp_gte: "${startTimestamp}", 
        createdTimestamp_lte: "${endTimestamp}", 
        status: OPEN
      }
    ) {
      id
      market {
        id
      }
      user {
        id
      }
      snxAccount {
        id
        accountId
      }
    }
  }
`;
