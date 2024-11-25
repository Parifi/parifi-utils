import { gql } from 'graphql-request';

export const fetchUserPortfolioInfo = (usersAddress: string[]) => gql`
{
  wallets(
      where: {id_in: [${usersAddress.map((id) => `"${id}"`).join(', ')}]}
    ) {
  	id
    snxAccounts {
      collateralDeposits {
        depositedAmount
        collateralSymbol
        collateralName
        collateralDecimals
      }
      orders {
      status
      collateralToken {
        symbol
      }
      deltaCollateral
    }
      positions {
        market{
          marketSymbol
        }
        status
        positionSize
        avgPrice
        realizedPnl
        realizedFee
      }
    }
  }
}
`;
