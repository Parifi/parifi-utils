import { TransactionStatusResponse } from '@gelatonetwork/relay-sdk';
import { RelayerConfig, RpcConfig } from '../interfaces';
import { checkGelatoTaskStatus, executeTxUsingGelato } from './gelato-function';

export class Gelato {
  constructor(
    private gelatoConfig: RelayerConfig['gelatoConfig'],
    private rpcConfig: RpcConfig,
  ) {}

  public async executeTxUsingGelato(targetContractAddress: string, encodedTxData: string): Promise<string> {
    return await executeTxUsingGelato(
      targetContractAddress,
      this.rpcConfig.chainId,
      this.gelatoConfig?.apiKey,
      encodedTxData,
    );
  }

  public checkGelatoTaskStatus = (taskId: string): Promise<TransactionStatusResponse | undefined> => {
    return checkGelatoTaskStatus(taskId);
  };
}
