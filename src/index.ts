import { Pyth } from './pyth';
import { Subgraph } from './subgraph';
import { GelatoConfig, PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from './interfaces/classConfigs';
import { Core } from './core';
import { Gelato } from './gelato';

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

  constructor(
    rpcConfig: RpcConfig,
    subgraphConfig: SubgraphConfig,
    relayerConfig: RelayerConfig,
    pythConfig: PythConfig,
    gelatoConfig: GelatoConfig,
  ) {
    this.subgraph = new Subgraph(rpcConfig, subgraphConfig);
    this.pyth = new Pyth(pythConfig);
    this.core = new Core(rpcConfig, subgraphConfig, relayerConfig, pythConfig);
    this.gelato = new Gelato(gelatoConfig, rpcConfig);
  }

  async init() {
    await this.pyth.initPyth();
  }
}
