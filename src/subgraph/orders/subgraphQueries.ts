import { gql } from 'graphql-request';

// Fetch all orders by `userAddress`
export const fetchOrdersByUserQuery = (userAddress: string, count: number = 10, skip: number = 0) =>
  gql`
    {
  orders(
    first: ${count}
    skip: ${skip}
    where: {user: "${userAddress}"}
    orderBy: createdTimestamp
    orderDirection: desc
  ) {
    id
		market { 
    	id
    }
    user { id }
    deadline
    deadlineISO
    orderType
    deltaSize
    deltaCollateral
   	expectedPrice 
    executionPrice
    isLong
    isLimitOrder
    triggerAbove
    status
    createdTimestamp
    txHash
    maxSlippage
    partnerAddress
    executionFee
    settledTxHash
    settledTimestamp
    cancellationTxHash
    settledBy { id }
    position { id positionSize }
  }   
}`;

export const fetchPendingOrdersQuery = (
  currentTimestamp: number = Math.floor(Date.now() / 1000),
  count: number,
  skip: number = 0,
) =>
  gql`
  {
  orders(
    where: {status: PENDING, deadline_gte: "${currentTimestamp}"}
    first: ${count}
    skip: ${skip}
    orderBy: createdTimestamp
    orderDirection: desc
  ) {
    id
    market {
      id
      pyth {
        id
        price
        lastUpdatedTimestamp
      }
    }
    deadline
    deadlineISO
    orderType
    deltaSize
    deltaCollateral
   	expectedPrice 
    executionPrice
    isLong
    status
    createdTimestamp
    txHash
    maxSlippage
    partnerAddress
    executionFee
    settledTxHash
    cancellationTxHash
  }
}
`;

export const fetchOrdersByIdQuery = (orderId: string) =>
  gql`
  {
    order(id: "${orderId}") {
    id
    user {
      id
    }
    market {
      id
    }
    orderType
    isLong
    isLimitOrder
    triggerAbove
    deadline
    deadlineISO
    deltaCollateral
    deltaSize
    deltaSizeUsd
   	expectedPrice 
    maxSlippage
    partnerAddress
    executionFee
    txHash
    createdTimestamp
    status
    settledTxHash
    settledTimestamp
    settledTimestampISO
    executionPrice
    settledBy { id }
    cancellationTxHash
    position { id }
  }
}
`;

export const fetchPriceIdsFromOrderIdsQuery = (orderIds: string[]) =>
  gql`
  {
    orders(
      where: {
        id_in: [${orderIds.map((id) => `"${id}"`).join(', ')}]
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
