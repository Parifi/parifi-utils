import request from 'graphql-request';
import { fetchExecutionFee } from './subgraphQueries';
import Decimal from 'decimal.js';
import { DECIMAL_ZERO } from '../../common';

export const getExecutionFee = async (
  subgraphEndpoint: string,
): Promise<{ executionFeeEth: Decimal; executionFeeUsdc: Decimal }> => {
  interface SubgraphResponseInterface {
    protocolData: {
      executionFeeEth: string;
      executionFeeUsdc: string;
    };
  }

  try {
    let subgraphResponse: SubgraphResponseInterface = await request(subgraphEndpoint, fetchExecutionFee());

    const executionFeeEth = new Decimal(subgraphResponse.protocolData.executionFeeEth);
    const executionFeeUsdc = new Decimal(subgraphResponse.protocolData.executionFeeUsdc);

    return { executionFeeEth, executionFeeUsdc };
  } catch (error) {
    // Return execution fee as zero in case of an error 
    console.log(error);
    return { executionFeeEth: DECIMAL_ZERO, executionFeeUsdc: DECIMAL_ZERO };
  }
};
