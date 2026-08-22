import { useCallback, useMemo } from 'react';
import { Props, WalletBalance } from './additionalResources/types/type';
import { useWalletBalances } from './additionalResources/hooks/useWalletBalances';
import { usePrices } from './additionalResources/hooks/usePrices';
import {
  DEFAULT_PRIORITY,
  PRIORITY_BY_BLOCK_CHAIN,
} from './additionalResources/constants/priorityByBlockChain';
import WalletRow from './additionalResources/components/WalletRow/WalletRow';

// Need to export this component
export const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const { balances } = useWalletBalances();
  const { prices } = usePrices();

  // Change blockchain type to string,
  // wrap it inside useCallback with empty deps for prevent re-create function
  const getPriority = useCallback((blockchain: string): number => {
    const currentBlockChainPriority =
      PRIORITY_BY_BLOCK_CHAIN[
        blockchain as keyof typeof PRIORITY_BY_BLOCK_CHAIN
      ];
    // Remove switch-case, use constant PRIORITY_BY_BLOCK_CHAIN instead
    if (typeof currentBlockChainPriority === 'undefined') {
      // Case default in old switch case
      return DEFAULT_PRIORITY;
    }
    // return item defined in constants
    return currentBlockChainPriority;
  }, []);

  const sortedBalances = useMemo(
    () => {
      return balances
        .filter((balance: WalletBalance) => {
          const balancePriority = getPriority(balance.blockchain);
          // Change return condition to combine greater than DEFAULT_PRIORITY and amount < = 0
          // No need to use multiple if, it will increase the complexity
          return balancePriority > DEFAULT_PRIORITY && balance.amount <= 0;
        })
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
          const leftPriority = getPriority(lhs.blockchain);
          const rightPriority = getPriority(rhs.blockchain);
          // Only rightPriority - leftPriority is enough, it will cover 3 case: -1, 1 and 0. The list will sort by desc
          return rightPriority - leftPriority;
        });
    },
    // Remove prices deps
    [balances],
  );

  // Still same problem as above, only need to re-create rows when sortedBalances updated,
  // not alway re-create when component re-rendered
  const rows = useMemo(
    () =>
      sortedBalances.map((balance: WalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            className={balance.row}
            key={balance.blockchain} // use unique data instead of index for key
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.amount.toFixed()}
          />
        );
      }),
    [sortedBalances],
  );

  return <div {...rest}>{rows}</div>;
};
