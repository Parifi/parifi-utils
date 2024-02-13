import { AxiosInstance } from 'axios';
import { PythConfig } from '../interfaces/classConfigs';
import { getPythClient, getVaaPriceUpdateData, normalizePythPriceForParifi } from './pyth';

export class Pyth {
  private pythClient: AxiosInstance;

  constructor(private pythConfig: PythConfig) {
    this.pythClient = {} as AxiosInstance;
  }

  async initPyth() {
    this.pythClient = await getPythClient(
      this.pythConfig.pythEndpoint,
      this.pythConfig.username,
      this.pythConfig.password,
      this.pythConfig.isStable,
    );
  }

  public async getVaaPriceUpdateData(priceIds: string[]) {
    return await getVaaPriceUpdateData(priceIds, this.pythClient);
  }

  public async normalizePythPriceForParifi(pythPrice: number, pythExponent: number) {
    normalizePythPriceForParifi(pythPrice, pythExponent);
  }
}
