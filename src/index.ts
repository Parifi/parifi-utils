import { Pyth } from './pyth';
import { Subgraph } from './subgraph';
import { PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from './interfaces/classConfigs';
import { Core } from './core';
import { Gelato } from './relayers/gelato';
import { relayerRepository } from './interfaces/repositories/relayer';
import { ParifiRelayer } from './relayers/parifi';
import { Pimlico } from './relayers/pimlico';

export * from './common';
export * from './core';
export * from './relayers/gelato/gelato-function';
export * from './interfaces';
export * from './pyth';
export * from './subgraph';

export class ParifiSdk {
  subgraph: Subgraph;
  pyth: Pyth;
  core: Core;
  relayer: {
    gelato: Gelato;
    parifi: relayerRepository;
    pimlico: Pimlico;
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
    this.relayer = {
      gelato: new Gelato(relayerConfig['gelatoConfig'], rpcConfig),
      parifi: new ParifiRelayer(relayerConfig['parifiRealyerConfig'], rpcConfig.chainId),
      pimlico: new Pimlico(relayerConfig['pimlicoConfig'], rpcConfig, subgraphConfig),
    };
  }

  async init() {
    await this.pyth.initPyth();
    await this.relayer.pimlico.initPimlico();
  }
}
