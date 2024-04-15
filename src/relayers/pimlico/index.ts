import 'dotenv/config';
import { appendFileSync } from 'fs';
import { ENTRYPOINT_ADDRESS_V07, SmartAccountClient, createSmartAccountClient } from 'permissionless';
import { RelayerConfig, RpcConfig } from '../../interfaces';
import { executeTxUsingPimlico, getViemChainById } from './utils';
import { SmartAccount, privateKeyToSimpleSmartAccount } from 'permissionless/accounts';
import { Chain, Hex, Transport, createPublicClient, http, toHex } from 'viem';

import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';

import { generatePrivateKey } from 'viem/accounts';

import { EntryPoint } from 'permissionless/types/entrypoint';
import { FACTORY_ADDRESS_SIMPLE_ACCOUNT } from '../../common';

export class Pimlico {
  /// Pimlico Class variables
  public isInitialized: boolean;
  private smartAccountClient: SmartAccountClient<EntryPoint, Transport, Chain, SmartAccount<EntryPoint>>;

  constructor(
    private pimlicoConfig: RelayerConfig['pimlicoConfig'],
    private rpcConfig: RpcConfig,
  ) {
    this.isInitialized = false;
    this.smartAccountClient = {} as SmartAccountClient<EntryPoint, Transport, Chain, SmartAccount<EntryPoint>>;
  }

  ////////////////////////////////////////////////////////////////
  //////////////////////    INITIALIZER    ///////////////////////
  ////////////////////////////////////////////////////////////////
  async initPimlico() {
    if (this.isInitialized) {
      return;
    }

    if (this.pimlicoConfig?.apiKey === undefined || this.rpcConfig.rpcEndpointUrl === undefined) {
      return;
    }

    const apiKey = this.pimlicoConfig?.apiKey;
    const viemChain = getViemChainById(this.rpcConfig.chainId as number);
    const chainId = this.rpcConfig.chainId as number;

    /// Create Paymaster Client
    const paymasterUrl = `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${apiKey}`;
    const publicClient = createPublicClient({
      transport: http(this.rpcConfig.rpcEndpointUrl),
    });

    const paymasterClient = createPimlicoPaymasterClient({
      transport: http(paymasterUrl),
      entryPoint: ENTRYPOINT_ADDRESS_V07,
    });

    /// Create Smart account for user address EOA
    const privateKey =
      (process.env.PRIVATE_KEY as Hex) ??
      (() => {
        const pk = generatePrivateKey();
        appendFileSync('.env', `PRIVATE_KEY=${pk}`);
        return pk;
      })();

    const account = await privateKeyToSimpleSmartAccount(publicClient, {
      privateKey,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      factoryAddress: FACTORY_ADDRESS_SIMPLE_ACCOUNT,
    });

    console.log(`Smart account address: https://arbiscan.io/address/${account.address}`);

    /// Create Bundler client
    const bundlerUrl = `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${apiKey}`;
    const bundlerClient = createPimlicoBundlerClient({
      transport: http(bundlerUrl),
      entryPoint: ENTRYPOINT_ADDRESS_V07,
    });

    /// Create Smart account client
    this.smartAccountClient = createSmartAccountClient({
      account,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      chain: viemChain,
      bundlerTransport: http(bundlerUrl),
      middleware: {
        gasPrice: async () => {
          return (await bundlerClient.getUserOperationGasPrice()).fast;
        },
        sponsorUserOperation: paymasterClient.sponsorUserOperation,
      },
    }) as SmartAccountClient<EntryPoint, Transport, Chain, SmartAccount<EntryPoint>>;

    // Set the Pimlico Relayer as initialized
    this.isInitialized = true;
  }

  ////////////////////////////////////////////////////////////////
  ////////////////////    PUBLIC FUNCTIONS    ////////////////////
  ////////////////////////////////////////////////////////////////
  executeTxUsingPimlico = async (targetContractAddress: string, txData: string) => {
    return await executeTxUsingPimlico(this.smartAccountClient, targetContractAddress, txData);
  };
}
