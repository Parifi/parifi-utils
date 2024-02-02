import axios, { AxiosInstance } from 'axios';
import { PRICE_FEED_DECIMALS, getUniqueValuesFromArray } from '../common';
import Decimal from 'decimal.js';

// Returns a Pyth client object based on the params provided
export const getPythClient = async (
  pythServiceEndpoint?: string,
  pythServiceUsername?: string,
  pythServicePassword?: string,
  isStable: boolean = true,
): Promise<AxiosInstance | undefined> => {
  try {
    if (pythServiceEndpoint) {
      if (pythServiceUsername && pythServicePassword) {
        // If Username and password is provided, connect using credentials
        return axios.create({
          baseURL: pythServiceEndpoint,
          auth: {
            username: pythServiceUsername,
            password: pythServicePassword,
          },
        });
      } else {
        // Connect to the PYTH service endpoint without authentication
        return axios.create({
          baseURL: pythServiceEndpoint,
        });
      }
    } else {
      // If Pyth service endpoint is not provided, connect to public endpoints
      if (isStable) {
        return axios.create({
          baseURL: 'https://hermes.pyth.network',
        });
      } else {
        return axios.create({
          baseURL: 'https://hermes-beta.pyth.network',
        });
      }
    }
  } catch (error) {
    console.log('Error when creating Pyth instance:', error);
    throw error;
  }
};

// The function accepts an array of priceIds and returns the priceUpdateData
// for them from Pyth
export async function getVaaPriceUpdateData(priceIds: string[], pythClient: AxiosInstance): Promise<string[]> {
  const uniquePriceIds = getUniqueValuesFromArray(priceIds);
  let priceUpdateData: string[] = [];

  if (pythClient) {
    try {
      const response = await pythClient.get('/api/latest_vaas', {
        params: {
          ids: uniquePriceIds,
        },
      });
      priceUpdateData = response.data;
    } catch (error) {
      console.log('Error fetching data from Pyth', error);
      throw error;
    }
  }
  return priceUpdateData.map((vaa) => '0x' + Buffer.from(vaa, 'base64').toString('hex'));
}

// Pyth currently uses different exponents for supported assets. Parifi uses all price feeds with 8 decimals
// This function converts the price from Pyth to a format Parifi uses with 8 decimals.
export const normalizePythPriceForParifi = (pythPrice: number, pythExponent: number): Decimal => {
  if (pythExponent > -PRICE_FEED_DECIMALS) {
    const adjustedFactor = new Decimal(10).pow(PRICE_FEED_DECIMALS + pythExponent);
    return new Decimal(pythPrice).mul(adjustedFactor);
  } else {
    const adjustedFactor = new Decimal(10).pow(-1 * (PRICE_FEED_DECIMALS + pythExponent));
    return new Decimal(pythPrice).div(adjustedFactor);
  }
};
