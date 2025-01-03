import { gql } from 'graphql-request';

// Fetch all orders by `userAddress`
export const fetchOrdersByUserQuery = (userAddress: string, count: number = 50, skip: number = 0) =>
  gql`{
    snxAccounts(
      first: ${count}
      skip: ${skip}
      where: { owner: "${userAddress}", type: PERP }) {
      id
      accountId
      owner {
        id
      }
      collateralDeposits {
        id
        currentDepositedAmount
        collateralName
        collateralSymbol
        collateralDecimals
        collateralAddress
      }
      orders {
        id
        market {
          id
          marketName
          marketSymbol
          feedId
        }
        expirationTime
        deltaSize
        deltaCollateral
        executionPrice
        isLimitOrder
        status
        createdTimestamp
        txHash
        partnerAddress
        collectedFees
        settledTxHash
        settledTimestamp
        deltaSizeUsd
        acceptablePrice
        settledBy {
          id
        }
      }
    }
  }
`;

export const fetchOrdersByIdQuery = (orderId: string) =>
  gql`
  {
    order(id: "${orderId}") {
    id
    market {
      id
      marketName
      marketSymbol
      feedId
    }
    expirationTime
    deltaSize
    deltaCollateral
    executionPrice
    isLimitOrder
    status
    createdTimestamp
    txHash
    partnerAddress
    collectedFees
    settledTxHash
    settledTimestamp
    deltaSizeUsd
    acceptablePrice
    settledBy {
      id
    }
    snxAccount {
      id
      accountId
    }
  }
}
`;
