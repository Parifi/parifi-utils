import 'dotenv/config';
import { Chain } from '@parifi/references';
import { PythConfig, RelayerConfig, RelayerI, RpcConfig, SubgraphConfig } from '../../src/interfaces/classConfigs';
import { ParifiSdk } from '../../src';
import { ethers } from 'ethers';

const chain = Chain.ARBITRUM_MAINNET;
const rpcConfig: RpcConfig = {
  chainId: chain,
};

const pythConfig: PythConfig = {
  pythEndpoint: process.env.PYTH_SERVICE_ENDPOINT,
  username: process.env.PYTH_SERVICE_USERNAME,
  password: process.env.PYTH_SERVICE_PASSWORD,
  isStable: true,
};

const gelatoConfig: RelayerI = {
  apiKey: process.env.GELATO_KEY || '',
};

const relayerConfig: RelayerConfig = {
  gelatoConfig: gelatoConfig,
};

const subgraphConfig: SubgraphConfig = {
  subgraphEndpoint:  process.env.SUBGRAPH_ENDPOINT,
};

const parifiSdk = new ParifiSdk(rpcConfig, subgraphConfig, relayerConfig, pythConfig);

describe('Parifi Utils tests', () => {
  it('should settle orders in batch using Parifi Utils', async () => {
    // To test the batch settle functionality, create some orders manually using the interface
    await parifiSdk.init();
    const orderCount = await parifiSdk.core.batchSettlePendingOrdersUsingGelato();
    console.log('Orders processed: ', orderCount);
  });

  it('should liquidate positions in batch using Parifi Utils', async () => {
    // To test the batch liquidate functionality, add correct position ids below
    await parifiSdk.init();
    const positionIds = ['0x00841110ab1304773ceb680ae39dcd0a50d3326a50de33aab6792d17a4483b04'];
    const positionsCount = await parifiSdk.core.batchLiquidatePositionsUsingGelato(positionIds);
    console.log('Positions processed: ', positionsCount);
  });

  it('should settle orders in batch using an external wallet', async () => {
    // To test the batch settle functionality, create some orders manually using the interface
    await parifiSdk.init();

    // Get orders that can be settled in the next 30 seconds
    const expiryTimestamp = Math.floor(Date.now() / 1000);
    console.log('expiryTimestamp', expiryTimestamp);
    const ordersCount = 10;

    const pendingOrders = await parifiSdk.subgraph.getAllPendingOrders(expiryTimestamp, ordersCount, 0);
    console.log(pendingOrders);

    // Return if orders are not available for settlement
    if (pendingOrders.length == 0) return;

    const orderIds: string[] = [];
    const priceIds: string[] = [];

    // Populate the price ids array to fetch price update data
    pendingOrders.forEach((order) => {
      if (order.id && order.market?.pyth?.id) {
        orderIds.push(order.id);
        priceIds.push(order.market.pyth.id);
      }
    });
    const collateralPriceIds = parifiSdk.pyth.getPriceIdsForCollaterals();
    const priceUpdateData = await parifiSdk.pyth.getVaaPriceUpdateData(priceIds.concat(collateralPriceIds));

    const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider);
    await parifiSdk.core.batchSettleOrdersUsingWallet(orderIds, priceUpdateData, wallet);
  });
});
