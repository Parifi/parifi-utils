import { Pyth } from './pyth';
import { Subgraph } from './subgraph';
import { PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from './interfaces/classConfigs';
import { Core } from './core';

export * from './common';
export * from './core';
export * from './gelato';
export * from './interfaces';
export * from './pyth';
export * from './subgraph';

export class ParifiSdk {
  subgraph: Subgraph;
  pyth: Pyth;
  core: Core;

  constructor(
    rpcConfig: RpcConfig,
    subgraphConfig: SubgraphConfig,
    relayerConfig: RelayerConfig,
    pythConfig: PythConfig,
  ) {
    this.subgraph = new Subgraph(rpcConfig, subgraphConfig);
    this.pyth = new Pyth(pythConfig);
    this.core = new Core(rpcConfig, subgraphConfig, relayerConfig, pythConfig);
  }

  async init() {
    await this.pyth.initPyth();
  }
}
