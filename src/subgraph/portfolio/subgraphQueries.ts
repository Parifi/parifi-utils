import { gql } from 'graphql-request';

// export const fetchUserPortfolioInfo = (usersAddress: string[]) => gql`
// {
//   wallets(
//       where: {id_in: [${usersAddress.map((id) => `"${id}"`).join(', ')}]}
//     ) {
//   	id
//     snxAccounts {
//       collateralDeposits {
//         depositedAmount
//         collateralSymbol
//         collateralName
//         collateralDecimals
//       }

//       positions {
//         market{
//           marketSymbol
//         }
//         status
//         positionSize
//         avgPrice
//         realizedPnl
//         realizedFee
//       }
//     }
//   }
// }
// `;
// export const fetchUserOpenPositionAndDepositCollateral = (usersAddress: string[]) => {
//   return gql`
//     query GetUserOpenPositionAndDepositCollateral {
//       wallets(where: { id_in: [${usersAddress.map((id) => `"${id}"`).join(', ')}] }) {
//         snxAccounts {
//           collateralDeposits {
//             depositedAmount
//             collateralSymbol
//             collateralName
//             collateralDecimals
//           }
//           positions(where: {status: OPEN}) {
//           snxAccount {
//            accountId
//         }
//           user{
//            id
//        }
//       }
//         }
//       }
//     }
//   `;
// };

// export const fecthLiquidatedPositionReliazedPnlBasedOnCollateralDeposits = (accountId: string[]) => {
//   return gql`
//     {
//       snxAccounts(where: { accountId_in: [${accountId.map((id) => `"${id}"`).join(', ')}] }) {
//           accountId
//           collateralDeposits {
//             depositedAmount
//             collateralSymbol
//             collateralName
//             collateralDecimals
//           }
//       }
//     }
//   `;
// };
