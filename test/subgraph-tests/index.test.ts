import { ParifiSdk } from '../../src';
import { gql } from 'graphql-request';
import { configDotenv } from 'dotenv';
import { getParifiSdkInstanceForTesting } from '..';
configDotenv();

describe('Query fetching logic from subgraph', () => {
  let parifiSdk: ParifiSdk | undefined = undefined;
  beforeAll(async () => {
    parifiSdk = await getParifiSdkInstanceForTesting();
  });
  it('should return results for fetching any valid query data', async () => {
    if (!parifiSdk) throw new Error('Parifi SDK not initialized');
    /// Subgraph query to get selective fields from positions
    const query = gql`
      {
        positions {
          id
          isLong
          lastRefresh
        }
      }
    `;

    const response = await parifiSdk.subgraph.executeSubgraphQuery(query);
    expect(response.positions.length).toBeGreaterThan(0);
  });
});
