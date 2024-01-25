import { request } from "graphql-request"
import { Chain } from "../../common/chain";
import { getSubgraphEndpoint } from "../common"
import { fetchOrdersByUser } from "./subgraphQueries"
import { mapOrdersArrayToInterface } from "../common/mapper"

// Get all order by a user address 
export const getAllOrdersByUserAddress = async (chainId: Chain, userAddress: string, count: number = 10) => {
    const subgraphEndpoint = getSubgraphEndpoint(chainId)

    const subgraphResponse = await request(subgraphEndpoint, fetchOrdersByUser(userAddress, count));
    return mapOrdersArrayToInterface(subgraphResponse);
}