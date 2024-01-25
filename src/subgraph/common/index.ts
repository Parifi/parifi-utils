import { subgraphEndpoints } from "./constants"
import { Chain } from "../../common/chain";

export const getSubgraphEndpoint = (chainId: Chain) => {
    return subgraphEndpoints[chainId];
};