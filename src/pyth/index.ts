import axios, { AxiosInstance } from 'axios';
import { getUniqueValuesFromArray } from '../common';

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
