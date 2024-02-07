import { Chain } from './common';
import { Pyth } from './pyth/pythClass';
import { SubGraph } from './subgraph';
import { PythConfig, RelayerConfig, RpcConfig, SubgraphConfig } from './types';

export * from './common';
export * from './subgraph';
export * from './core';

class SDK {
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

// testing //

const rpcConfig: RpcConfig = {
  chainId: 12345 as Chain,
};

const subGraphConfig: SubgraphConfig = {};
const relayerConfig: RelayerConfig = {};
const pythConfig: PythConfig = {};
const userAddress = '123456';

const sdk = new SDK(rpcConfig, subGraphConfig, relayerConfig, pythConfig);
sdk.subgraph.getAllOrdersByUserAddress(userAddress);

// export class Common{
//     chainId!: Chain;
//     rpcUrl!: string;
//     subGraphUrl!: string;

//     constructor(chainID: Chain,rpcUrl: string,subGraphUrl: string){
//         this.chainId = chainID;
//         this.rpcUrl = rpcUrl;
//         this.subGraphUrl = subGraphUrl;
//     }

// }

// function mixin(...classes:any) {
//     return Object.assign({}, ...classes);
//   }

//   // Create an object with combined functionality
//   const combinedObject = mixin(new SubGraph(), new SubGraph1());

//   // Now you can access the methods of both classes using this single object
//   combinedObject.method1(); // Output: Method 1 from Class 1
//   combinedObject.method2(); // Output: Method 2 from Class 2

// Define mixin classes
// class Foo {
//     foo() {
//         console.log("Foo method");
//     }
// }

// class Bar {
//     bar() {
//         console.log("Bar method");
//     }
// }

// // Define a function that applies mixins to a base class
// function applyMixins(derivedCtor: any, baseCtors: any[]) {
//     baseCtors.forEach(baseCtor => {
//         Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
//             derivedCtor.prototype[name] = baseCtor.prototype[name];
//         });
//     });
// }

// // Define a class that inherits from Foo and Bar using mixins
// class MyClass implements Foo, Bar {
//     // Define properties and methods of MyClass
//     constructor() {}
//     // Placeholder implementations for interface methods
//     foo!: () => void;
//     bar!: () => void;
// }

// // Apply mixins
// applyMixins(MyClass, [Foo, Bar]);

// // Usage
// const myObject = new MyClass();
// myObject.foo(); // Output: Foo method
// myObject.bar(); // Output: Bar method
