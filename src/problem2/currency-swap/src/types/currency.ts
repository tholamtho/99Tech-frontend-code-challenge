export interface ITokenPrice extends ITokenBaseData {
  currency: string;
}

export interface ITokenBaseData {
  date: string;
  price: number;
}

export interface ITokenInfo {
  [key: string]: ITokenBaseData;
}

export interface ITokenDropdown {
  value: string;
  price: number;
}

export interface IFromToDropDownListData {
  fromOptionsList: ITokenDropdown[];
  toOptionsList: ITokenDropdown[];
}

export interface ISwapHistoryItem {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  timestamp: number;
}
