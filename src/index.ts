import { Pyth } from './pyth';
import { Subgraph } from './subgraph';
import { PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from './interfaces/classConfigs';
import { Core } from './core';
import { Gelato } from './gelato';
import { relayerRepository } from './interfaces/repositories/relayer';
import { ParifiRelayer } from './relayers/parifi';

export * from './common';
export * from './core';
export * from './gelato/gelato-function';
export * from './interfaces';
export * from './pyth';
export * from './subgraph';

export class ParifiSdk {
  subgraph: Subgraph;
  pyth: Pyth;
  core: Core;
  gelato: Gelato;
  relayer: {
    parifi: relayerRepository;
  };

  constructor(
    rpcConfig: RpcConfig,
    subgraphConfig: SubgraphConfig,
    relayerConfig: RelayerConfig,
    pythConfig: PythConfig,
  ) {
    this.subgraph = new Subgraph(rpcConfig, subgraphConfig, pythConfig);
    this.pyth = new Pyth(pythConfig);
    this.core = new Core(rpcConfig, subgraphConfig, relayerConfig, pythConfig);
    this.gelato = new Gelato(relayerConfig['gelatoConfig'], rpcConfig);
    this.relayer = {
      parifi: new ParifiRelayer(relayerConfig['parifiRealyerConfig'], rpcConfig.chainId),
    };
  }

  async init() {
    await this.pyth.initPyth();
  }
}
