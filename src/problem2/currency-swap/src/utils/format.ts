// Format Number
export const formatAmount = (value: number, maxFractionDigits = 6): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
};

// Format decimal for number
export const formatRate = (rate: number): string => {
  return formatAmount(rate, 8);
};

// Format Time display
export const formatTimestamp = (timestamp: number): string => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
};
