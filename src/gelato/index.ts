import { TransactionStatusResponse } from '@gelatonetwork/relay-sdk';
import { GelatoConfig, PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from '../interfaces';
import { checkGelatoTaskStatus, executeTxUsingGelato } from './gelato-function';

export class Gelato {
  constructor(
    private gelatoConfig: GelatoConfig,
    private rpcConfig: RpcConfig,
  ) {}

  public async executeTxUsingGelato(targetContractAddress: string, encodedTxData: string): Promise<string> {
    return await executeTxUsingGelato(
      targetContractAddress,
      this.rpcConfig.chainId,
      this.gelatoConfig.apiKey,
      encodedTxData,
    );
  }

  public checkGelatoTaskStatus = (taskId: string): Promise<TransactionStatusResponse | undefined> => {
    return checkGelatoTaskStatus(taskId);
  };
}
