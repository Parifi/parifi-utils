import { RelayerConfig } from '../../interfaces';
import { RelayerTransaction, relayerRepository } from '../../interfaces/repositories/relayer';

export class ParifiRelayer implements relayerRepository {
  private token: string;
  public url: string;
  public chainId: number;

  constructor(relayerConfig: RelayerConfig['parifiRealyerConfig'], chainId: number) {
    this.token = relayerConfig?.jwtToken ?? '';
    this.url = relayerConfig?.relayerEndpoint ?? 'https://balancer.parifi.org';
    this.chainId = chainId;
  }

  async executeTx({ customTxId, ...tx }: RelayerTransaction) {
    const response = await fetch(`${this.url}/send`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ tx, chainId: this.chainId.toString(), customTxId }),
    });
    const data = await response.json();

    return (customTxId ?? data.txId) as string;
  }

  async checkStatus(_hash: string) {
    return undefined;
  }
}
