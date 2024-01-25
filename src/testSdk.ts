import { Chain } from "./common/chain";
import "./subgraph"
import { getAllPendingOrders, getAllPositionsByUserAddress } from "./subgraph";

export function sayHello(): void {
  console.log('Hello, World!');
}

const chainId = 421614 as Chain;

async function main() {
  try {
    let userAddress: string;
    // Test markets
    // const markets = await getAllMarketsFromSubgraph(chainId);
    // console.log("Total markets:", markets.length)
    // console.log("Second market id ", markets[1].id)

    // Test orders
    // const orders = await getAllPendingOrders(chainId, Math.floor(Date.now() / 1000), 2)
    // console.log("orders", orders.length);

    // Test positions
    userAddress = "0x552af4af77b514e0dd1fb5b40a868e7dce3fd794"
        const positions = await getAllPositionsByUserAddress(chainId, userAddress, 2)
        console.log("array length", positions.length);
        console.log(positions)

  } catch (error) {
    console.error('Error:', error);
  }
}

main();