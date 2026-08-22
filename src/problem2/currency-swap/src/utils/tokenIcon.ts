const TOKEN_ICON_BASE_URL = '/tokens';

/**
 * A handful of price-feed currency codes don't match the casing of their
 * icon file in public/tokens (e.g. staked-asset prefixes are lowercase
 * there but uppercase in the price feed).
 */
const TOKEN_ICON_ALIASES: Record<string, string> = {
  STEVMOS: 'stEVMOS',
  RATOM: 'rATOM',
  STOSMO: 'stOSMO',
  STATOM: 'stATOM',
  STLUNA: 'stLUNA',
};

export const getTokenIconUrl = (symbol: string): string => {
  const fileName = TOKEN_ICON_ALIASES[symbol] ?? symbol;
  return `${TOKEN_ICON_BASE_URL}/${fileName}.svg`;
};
