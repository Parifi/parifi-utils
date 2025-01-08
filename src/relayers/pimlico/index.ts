import 'dotenv/config';
import { RelayerConfig, RpcConfig, SubgraphConfig } from '../../interfaces';
import { executeTxUsingPimlico, getPimlicoSmartAccountClient } from './utils';
import { SmartAccount } from 'permissionless/accounts';
import { Chain, Hex, Transport } from 'viem';
import { EntryPoint } from 'permissionless/types/entrypoint';
import { SmartAccountClient } from 'permissionless';
import { generatePrivateKey } from 'viem/accounts';

export class Pimlico {
  /// Pimlico Class variables
  public isInitialized: boolean;
  private smartAccountClient: SmartAccountClient<EntryPoint, Transport, Chain, SmartAccount<EntryPoint>>;

  constructor(
    private pimlicoConfig: RelayerConfig['pimlicoConfig'],
    private rpcConfig: RpcConfig,
    private subgraphConfig: SubgraphConfig,
  ) {
    this.isInitialized = false;
    this.smartAccountClient = {} as SmartAccountClient<EntryPoint, Transport, Chain, SmartAccount<EntryPoint>>;
  }

  ////////////////////////////////////////////////////////////////
  //////////////////////    INITIALIZER    ///////////////////////
  ////////////////////////////////////////////////////////////////
  async initPimlico() {
    if (this.isInitialized) {
      console.log('Pimlico relayer already initialized');
      return;
    }

    if (this.pimlicoConfig?.apiKey === undefined || this.rpcConfig.rpcEndpointUrl === undefined) {
      console.log('Invalid config for Pimlico');
      return;
    }

    /// Create Smart account for user address EOA
    const privateKey =
      ((process.env.PRIVATE_KEY as Hex) || this.pimlicoConfig.password) ??
      (() => {
        const pk = generatePrivateKey();
        this.pimlicoConfig.password = pk;
        return pk;
      })();

    this.smartAccountClient = await getPimlicoSmartAccountClient(this.pimlicoConfig, this.rpcConfig, privateKey);

    // Set the Pimlico Relayer as initialized
    this.isInitialized = true;
  }

  ////////////////////////////////////////////////////////////////
  ////////////////////    PUBLIC FUNCTIONS    ////////////////////
  ////////////////////////////////////////////////////////////////
  public executeTxUsingPimlico = async (targetContractAddress: string, txData: string) => {
    return await executeTxUsingPimlico(this.smartAccountClient, targetContractAddress, txData);
  };
}
