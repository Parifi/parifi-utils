import { Pyth } from './pyth';
import { Subgraph } from './subgraph';
import { PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from './interfaces/classConfigs';
import { Gelato } from './relayers/gelato';
import { Perps } from './perps';
import { Pimlico } from './relayers';

export * from './common';
export * from './relayers/gelato/gelato-function';
export * from './interfaces';
export * from './pyth';
export * from './subgraph';
export * from './perps';

export class ParifiSdk {
  subgraph: Subgraph;
  pyth: Pyth;
  perps: Perps;
  relayer: {
    gelato: Gelato;
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
    this.perps = new Perps();
    this.relayer = {
      gelato: new Gelato(relayerConfig['gelatoConfig'], rpcConfig),
      pimlico: new Pimlico(relayerConfig['pimlicoConfig'], rpcConfig, subgraphConfig),
    };
  }

  async init() {
    await this.pyth.initPyth();
    await this.relayer.pimlico.initPimlico();
  }
}
