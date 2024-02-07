import { PythPriceResponse } from '../subgraph';

// Function to map the pyth latest price response to interface
export const mapPythPriceResponseToInterface = (response: any[]): PythPriceResponse[] => {
  return response.map((item) => ({
    id: item.id || '',
    price: {
      price: item.price.price || '0',
      conf: item.price.conf || '0',
      expo: item.price.expo || 0,
      publish_time: item.price.publish_time || 0,
    },
    ema_price: {
      price: item.ema_price.price || '0',
      conf: item.ema_price.conf || '0',
      expo: item.ema_price.expo || 0,
      publish_time: item.ema_price.publish_time || 0,
    },
  }));
};
