export interface WalletBalance {
  currency: string;
  amount: number;
  // Change blockchain to string
  blockchain: string;
  // Add more row key
  row: string;
}

// Old code duplicate key currency and amount, so use extends is enough
export interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// Add missing BoxProps interface
export interface BoxProps {
  className: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

export interface Props extends BoxProps {
  children: any;
}

export interface WalletPrice {
  [key: string]: number;
}
