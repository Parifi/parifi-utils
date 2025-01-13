import { gql } from 'graphql-request';

// Fetches all positions by a user (Both open and closed)
export const fetchPositionsByUserQuery = (userAddress: string, count: number = 20, skip: number = 0) =>
  gql`
    {
    snxAccounts(
      first: ${count}
      skip: ${skip}
      where: { owner: "${userAddress}", type: PERP, positions_: {status_in: [OPEN, CLOSED, LIQUIDATED]} }) {
      id
      accountId
      owner {
        id
      }
      collateralDeposits {
        id
        collateralName
        collateralSymbol
        collateralDecimals
        collateralAddress
        currentDepositedAmount
        totalAmountDeposited
        totalAmountWithdrawn
        totalAmountLiquidated
      }
      positions {
        id
        market {
          id
          marketName
          marketSymbol
          feedId
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
    }
  }`;

// Fetches positions for a user address by status
export const fetchPositionsByUserQueryAndStatus = (
  userAddress: string,
  status: string,
  count: number = 20,
  skip: number = 0,
) =>
  gql`
    {
    snxAccounts(
      first: ${count}
      skip: ${skip}
      where: { owner: "${userAddress}", type: PERP, positions_: {status: "${status}"} }
    ) {
      id
      accountId
      owner {
        id
      }
      collateralDeposits {
        id
        collateralName
        collateralSymbol
        collateralDecimals
        collateralAddress
        currentDepositedAmount
        totalAmountDeposited
        totalAmountWithdrawn
        totalAmountLiquidated
      }
      positions {
        id
        market {
          id
          marketName
          marketSymbol
          feedId
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
    }
  }`;

// Fetches positions for a user address by status
export const fetchUserPositionHistory = (userAddress: string, count: number = 20, skip: number = 0) =>
  gql`
    {
    snxAccounts(
      first: ${count}
      skip: ${skip}
      where: { owner: "${userAddress}", type: PERP, positions_: {status_in: [CLOSED, LIQUIDATED]} }
    ) {
      id
      accountId
      owner {
        id
      }
      collateralDeposits {
        id
        collateralName
        collateralSymbol
        collateralDecimals
        collateralAddress
        currentDepositedAmount
        totalAmountDeposited
        totalAmountWithdrawn
        totalAmountLiquidated
      }
      positions {
        id
        market {
          id
          marketName
          marketSymbol
          feedId
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
              id,
              marketName,
              marketSymbol,
              feedId 
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

export const fetchPositionsToLiquidateQuery = (count: number) => gql`
  {
    positions(where: { status: OPEN, canBeLiquidated: true }, first: ${count}, orderBy: positionSize, orderDirection: desc) {
      id
    }
  }
`;

// Fetches positions for a user address by status
export const fetchUserPositionHistoryWithTime = (
  userAddress: string,
  startTimestamp: number,
  endTimestamp: number,
  count: number = 20,
  skip: number = 0,
) =>
  gql`
    {
    snxAccounts(
      first: ${count}
      skip: ${skip}
      where: {
        owner: "${userAddress}",
        type: PERP,
        positions_: {
          status_in: [CLOSED, LIQUIDATED],
          createdTimestamp_gte: ${startTimestamp}
          createdTimestamp_lte: ${endTimestamp}
          }
      }
    ) {
      id
      accountId
      owner {
        id
      }
      collateralDeposits {
        id
        collateralName
        collateralSymbol
        collateralDecimals
        collateralAddress
        currentDepositedAmount
        totalAmountDeposited
        totalAmountWithdrawn
        totalAmountLiquidated
      }
      positions {
        id
        market {
          id
          marketName
          marketSymbol
          feedId
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
    }
  }`;

// Fetches positions for a user address by status
export const fetchUserOpenPositionsWithTime = (
  userAddress: string,
  startTimestamp: number,
  endTimestamp: number,
  count: number = 20,
  skip: number = 0,
) =>
  gql`
    {
    snxAccounts(
      first: ${count}
      skip: ${skip}
      where: {
        owner: "${userAddress}",
        type: PERP,
        positions_: {
          status: OPEN,
          createdTimestamp_gte: ${startTimestamp}
          createdTimestamp_lte: ${endTimestamp}
          }
      }
    ) {
      id
      accountId
      owner {
        id
      }
      collateralDeposits {
        id
        collateralName
        collateralSymbol
        collateralDecimals
        collateralAddress
        currentDepositedAmount
        totalAmountDeposited
        totalAmountWithdrawn
        totalAmountLiquidated
      }
      positions {
        id
        market {
          id
          marketName
          marketSymbol
          feedId
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
    }
  }`;

export const fetchPositionsBySnxAccount = (snxAccountId: string) =>
  gql`
    {
    snxAccount(id: "${snxAccountId}"
    ) {
      id
      accountId
      owner {
        id
      }
      collateralDeposits {
        id
        collateralName
        collateralSymbol
        collateralDecimals
        collateralAddress
        currentDepositedAmount
        totalAmountDeposited
        totalAmountWithdrawn
        totalAmountLiquidated
      }
      positions {
        id
        market {
          id
          marketName
          marketSymbol
          feedId
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
    }
  }`;
