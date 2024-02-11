import { Pyth } from './pyth/pyth';
import { Subgraph } from './subgraph';
import { PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from './types';

export * from './common';
export * from './subgraph';
export * from './core';

export class ParifiSdk {
  subgraph: Subgraph;
  pyth: Pyth;

  constructor(
    rpcConfig: RpcConfig,
    subgraphConfig: SubgraphConfig,
    relayerConfig: RelayerConfig,
    pythConfig: PythConfig,
  ) {
    this.subgraph = new Subgraph(rpcConfig, subgraphConfig);
    this.pyth = new Pyth(pythConfig);
  }
}
