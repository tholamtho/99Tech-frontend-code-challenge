import { useCallback, useState } from 'react';
import defaultPrices from '@/constants/defaultPrice.json';
import type { ITokenInfo, ITokenPrice } from '@/types/currency';
import axiosInstance from '@/utils/axiosInstance';

const dedupeLatestByCurrency = (priceList: ITokenPrice[]): ITokenInfo => {
  const tempResult: ITokenInfo = {};
  priceList.forEach((item: ITokenPrice) => {
    // Ignore undefined/null/empty data
    if (!item.currency || !item.date || !item.price) {
      return;
    }

    // Add data to result list if not existed in list
    if (!tempResult[item.currency]) {
      const { date, price } = item;
      tempResult[item.currency] = {
        date,
        price,
      };
      return;
    }
    // If existed, replace with lastest one
    const existedDate = new Date(tempResult[item.currency].date).getTime();
    const currentDate = new Date(item.date).getTime();

    if (existedDate < currentDate) {
      const { date, price } = item;
      tempResult[item.currency] = {
        date,
        price,
      };
    }
  });

  return tempResult;
};

/**
 * Get price list from provided API, return data inside defaultPrice.json if there is any error
 * @returns Price list data
 */
const handleGetPriceDataList = async (): Promise<ITokenPrice[]> => {
  try {
    const response = await axiosInstance.get(
      import.meta.env.VITE_PRICE_LIST_URL,
    );
    return (response.data ?? []) as ITokenPrice[];
  } catch (error) {
    console.error(error);
    // Return default price list
    return defaultPrices as ITokenPrice[];
  }
};

// Simulate delay like call API
const SIMULATED_DELAY_MS = 600;

// Custom hook for token prices list
export const useTokenPrices = () => {
  const [tokens, setTokens] = useState<ITokenInfo>({});
  const [loading, setLoading] = useState(true);

  const handleGetInitPriceData = useCallback(async () => {
    const list = await handleGetPriceDataList();
    setLoading(false);
    const timeOut = setTimeout(() => {
      setTokens(dedupeLatestByCurrency(list));
    }, SIMULATED_DELAY_MS);
    return () => clearTimeout(timeOut);
  }, []);

  return { tokens, loading, handleGetInitPriceData };
};
