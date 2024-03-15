# Parifi SDK

Parifi SDK simplifies the integration of Parifi protocol functionalities into your projects. It abstracts away technical implementation details, making it easier for developers and partners to build on top of the protocol.

## Features

- **Abstraction of Technical Details:** The SDK abstracts away the low-level technical implementation details of protocol functionalities, allowing developers to focus on building their applications without worrying about the underlying complexities.

- **Flexible Configuration:** Developers can configure the SDK with RPC, Subgraph, Relayer, and Pyth price feed details. Most configurations are optional, with default public values provided if not specified.

- **Reduced Development Time:** By providing easy-to-use functions, the SDK significantly reduces overall development time for integrating Parifi protocol functionalities into projects.

## Installation

To install the Parifi SDK, you can use npm or yarn:

```bash
npm install @parifi/sdk
```

or

```bash
yarn add @parifi/sdk
```

## Usage

1. **Import the SDK:** Import the Parifi SDK into your project.

```javascript
import { ParifiSdk } from '@parifi/sdk';
```

2. **Initialize Parifi SDK:** Initialize the Parifi SDK with your configuration details.

```javascript
const rpcConfig = { /* RPC configuration */ };
const subgraphConfig = { /* Subgraph configuration */ };
const relayerConfig = { /* Relayer configuration */ };
const pythConfig = { /* Pyth price feed configuration */ };

const parifiSdk = new ParifiSdk(rpcConfig, subgraphConfig, relayerConfig, pythConfig);
```

3. **Initialize Parifi SDK:** Initialize the Parifi SDK with your configuration details.

```javascript
const parifiSdk = new ParifiSdk(rpcConfig, subgraphConfig, relayerConfig, pythConfig);
await parifiSdk.init();
```

4. **Use Parifi SDK Functions:** Use the functions provided by the Parifi SDK to access protocol functionalities.

```javascript
const positionsToLiquidate = await parifiSdk.subgraph.getPositionsToLiquidate();
```


## Support

If you encounter any issues or have any questions about the Parifi SDK, please don't hesitate to reach out to our team at dev@parifi.org.

## Contributing

We welcome contributions from the community! If you have any suggestions, bug fixes, or new features to propose, please open an issue or submit a pull request on our GitHub repository.