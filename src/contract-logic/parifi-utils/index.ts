import { Contract, ethers } from 'ethers';
import { Chain } from '@parifi/references';
import { contracts as parifiContracts } from '@parifi/references';

// Returns an Order Manager contract instance without signer
export const getParifiUtilsInstance = (chain: Chain): Contract => {
  try {
    return new ethers.Contract(parifiContracts[chain].ParifiUtils.address, parifiContracts[chain].ParifiUtils.abi);
  } catch (error) {
    throw error;
  }
};
