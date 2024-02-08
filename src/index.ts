import { Pyth } from './pyth/pyth';
import { SubGraph } from './subgraph';
import { PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from './types';

export * from './common';
export * from './subgraph';
export * from './core';

export class SDK {
  subgraph: SubGraph;
  pyth: Pyth;

  constructor(
    rpcConfig: RpcConfig,
    subGraphConfig: SubgraphConfig,
    relayrConfig: RelayerConfig,
    pythConfig: PythConfig,
  ) {
    this.subgraph = new SubGraph(rpcConfig, subGraphConfig);
    this.pyth = new Pyth(pythConfig);
  }
}
