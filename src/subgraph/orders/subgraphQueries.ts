import { gql } from 'graphql-request';

// Fetch all orders by `userAddress`
export const fetchOrdersByUserQuery = (userAddress: string, count: number = 10, skip: number = 0) =>
  gql`
    {
  orders(
    first: ${count}
    skip: ${skip}
    where: {user: "${userAddress.toLowerCase()}"}
    orderBy: createdTimestamp
    orderDirection: desc
  ) {
    id
    market {
      id,symbol,marketName,marketSymbol,feedId 
    }
    user { id }
    expirationTime
    orderType
    deltaSize 
    deltaCollateral
   	expectedPrice 
    executionPrice
    isLong
    isLimitOrder
    status
    createdTimestamp
    txHash
    partnerAddress
    collectedFees
    settledTxHash
    settledTimestamp
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
    where: {status: PENDING ,expirationTime_gt:"${currentTimestamp}"}
    first: ${count}
    skip: ${skip}
    orderBy: createdTimestamp
    orderDirection: desc
  ) {
    id
    market {
      id,symbol,marketName,marketSymbol,feedId 
    }
    orderType
    isLong
    isLimitOrder
    expirationTime
    deltaCollateral
    deltaSize
    deltaSizeUsd
   	expectedPrice 
    partnerAddress
    collectedFees
    txHash
    createdTimestamp
    status
    settledTxHash
    settledTimestamp
    settledTimestampISO
    executionPrice
    settledBy { id }
    position { id }
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
      id,marketSymbol,marketName,marketSymbol,feedId 
    }
    isLimitOrder
    expirationTime
    deltaCollateral
    deltaSize
    collateralToken
    deltaSizeUsd
    acceptablePrice 
    partnerAddress
    collectedFees
    txHash
    createdTimestamp
    status
    settledTxHash
    settledTimestamp
    settledTimestampISO
    trackingCode
    executionPrice
    settledBy { id }
    position { id }
  }
}
`;

export const fetchPriceIdsFromOrderIdsQuery = (orderIds: string[]) =>
  gql`
  {
    orders(
      where: {
        id_in: [${orderIds.map((id) => `"${id.toLowerCase()}"`).join(', ')}]
      }
    ) {
      id
      market {
      feedId 
    }
    }
  }
`;

export const fetchPartnerRewards = (partnerAddress: string, count: number = 20, skip: number = 0) => gql`
  {
    referrals(
      first: ${count}
      skip: ${skip}
      orderBy: timestamp
      orderDirection: desc
      where: { partner: "${partnerAddress.toLowerCase()}" }
    ) {
      id
      partner { id }
      referredUser { id }
      sizeInUsd
      timestamp
      txHash
      rewardToken { id symbol decimals }
      referralRewardsInUsd
      referralRewardsInToken
    }
  }
`;

export const fetchPositionIdsForOrderIds = (orderIds: string[]) => gql`
{
  orders(
    where: {
      id_in: [${orderIds.map((id) => `"${id.toLowerCase()}"`).join(', ')}]
    }
  ) {
    id
    position { id }
  }
}
`;
