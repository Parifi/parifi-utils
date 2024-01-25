import { gql } from "graphql-request";

export const fetchPositionsByUserQuery = (userAddress: string, count: number = 10) =>
    gql`
    {
        positions(
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
    }`
