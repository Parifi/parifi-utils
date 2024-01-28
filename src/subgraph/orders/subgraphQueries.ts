import { gql } from "graphql-request";

// Fetch all orders by `userAddress`
export const fetchOrdersByUserQuery = (userAddress: string, count: number = 10) =>
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

export const fetchPendingOrdersQuery = (currentTimestamp: number = Math.floor(Date.now() / 1000), count: number) =>
  gql`
  {
  orders(
    where: {status: PENDING, deadline_gte: "${currentTimestamp}"}
    first: ${count}
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