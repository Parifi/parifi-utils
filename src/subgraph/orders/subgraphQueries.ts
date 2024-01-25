import { gql } from "graphql-request";

// Fetch all orders by `userAddress`
export const fetchOrdersByUser = (userAddress: string, count: number = 10) =>
  gql`
    {
  orders(
    first: ${count}
    where: {user: "${userAddress}"}
    orderBy: createdTimestamp
    orderDirection: desc
  ) {
    id
		market { 
    	id
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
}`

export const fetchPendingOrdersQuery = (currentTimestamp: number = Date.now() / 1000) =>
  gql`
  {
  orders(
    where: {status: PENDING, deadline_gte: "${currentTimestamp}"}
    first: 100
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
    expectedPrice
    deadline
    isLong
    maxSlippage
    isLimitOrder
    triggerAbove
  }
}
`;