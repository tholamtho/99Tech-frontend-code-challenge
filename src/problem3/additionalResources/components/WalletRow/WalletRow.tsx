import { BoxProps } from '../../types/type';

const WalletRow = ({
  amount,
  className,
  usdValue,
  formattedAmount,
}: BoxProps) => {
  return (
    <div className={className}>
      <div>{amount}</div>
      <div>{usdValue}</div>
      <div>{formattedAmount}</div>
    </div>
  );
};

export default WalletRow;
