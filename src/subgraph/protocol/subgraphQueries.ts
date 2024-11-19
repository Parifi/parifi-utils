import { gql } from 'graphql-request';

// Fetch execution fee for protocol from subgraph
export const fetchExecutionFee = () => gql`
  {
    protocolData(id: "1") {
      executionFeeEth
      executionFeeUsdc
    }
  }
`;

export const fetchProtocolTradeInfo = () => gql`
 { protocolDatas {
    orderTotalFees
    totalVolume
    totalActivePositions
    activeUsersCount
  }}
`;
