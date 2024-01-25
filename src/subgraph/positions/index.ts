import { request } from "graphql-request"
import { Chain } from "../../common/chain";
import { getSubgraphEndpoint } from "../common"
import { fetchPositionsByUserQuery } from "./subgraphQueries";
import { mapPositionsArrayToInterface } from "../common/mapper";

// Get all positions by user address
export const getAllPositionsByUserAddress = async (chainId: Chain, userAddress: string, count: number = 10) => {
    const subgraphEndpoint = getSubgraphEndpoint(chainId)

    const query = fetchPositionsByUserQuery(userAddress, count);

    const subgraphResponse = await request(subgraphEndpoint, query);
    return mapPositionsArrayToInterface(subgraphResponse);
}