import { Chain } from "../../common/chain";

export const subgraphEndpoints: { [key in Chain]: string } = {
    [Chain.ARBITRUM_GOERLI]:
        "https://api.thegraph.com/subgraphs/name/parifi/parifi-arbitrum",
    [Chain.ARBITRUM_SEPOLIA]:
        "https://api.thegraph.com/subgraphs/name/parifi/parifi-sepolia",
    [Chain.ARBITRUM]: "",
    [Chain.POLYGON]: "",
    [Chain.BASE]: "",
};