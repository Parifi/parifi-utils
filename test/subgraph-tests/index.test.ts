import { Chain } from '@parifi/references';
import { ParifiSdk } from '../../src';
import { RpcConfig } from '../../src/interfaces/classConfigs';
import { gql } from 'graphql-request';
const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_SEPOLIA,
};

const parifiSdk = new ParifiSdk(rpcConfig, {}, {}, {});

describe('Query fetching logic from subgraph', () => {
  it('should return results for fetching any valid query data', async () => {
    await parifiSdk.init();

    /// Subgraph query to get selective fields from positions
    const query = gql`
      {
        positions{
          id
          isLong
          lastRefresh
        }
      }
    `;

    const response = await parifiSdk.subgraph.executeSubgraphQuery(query);
  });
});
