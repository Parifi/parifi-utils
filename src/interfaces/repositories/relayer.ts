import { TransactionStatusResponse } from '@gelatonetwork/relay-sdk';

export type RelayerTransaction = {
  to: string;
  data: string;
  value: string | number;
  customTxId?: string;
};

export interface relayerRepository {
  executeTx: (tx: RelayerTransaction) => Promise<string>;
  checkStatus: (identifier: string) => Promise<TransactionStatusResponse | undefined>;
}
