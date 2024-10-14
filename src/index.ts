import { Pyth } from './pyth';
import { Subgraph } from './subgraph';
import { PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from './interfaces/classConfigs';
import { Gelato } from './relayers/gelato';
import { relayerRepository } from './interfaces/repositories/relayer';
import { ParifiRelayer } from './relayers/parifi';
import { Perps } from './perps';

export * from './common';
export * from './relayers/gelato/gelato-function';
export * from './interfaces';
export * from './pyth';
export * from './subgraph';
export * from './perps'

export class ParifiSdk {
  subgraph: Subgraph;
  pyth: Pyth;
  perps: Perps;
  relayer: {
    gelato: Gelato;
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
    this.perps = new Perps();
    this.relayer = {
      gelato: new Gelato(relayerConfig['gelatoConfig'], rpcConfig),
      parifi: new ParifiRelayer(relayerConfig['parifiRealyerConfig'], rpcConfig.chainId),
    };
  }

  async init() {
    await this.pyth.initPyth();
  }
}
