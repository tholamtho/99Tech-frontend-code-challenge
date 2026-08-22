import { RedoOutlined } from '@ant-design/icons';
import { Empty, Space, Typography } from 'antd';
import BaseButton from '@/components/BaseButton/BaseButton';
import TokenIcon from '@/components/TokenIcon/TokenIcon';
import { formatAmount, formatRate, formatTimestamp } from '@/utils/format';
import type { ISwapHistoryItem } from '@/types/currency';

const { Text } = Typography;

interface SwapHistoryProps {
  history: ISwapHistoryItem[];
  onClear: () => void;
  onApply: (item: ISwapHistoryItem) => void;
}

const SwapHistory = ({ history, onClear, onApply }: SwapHistoryProps) => {
  return (
    <div className='w-full max-w-xl mt-8'>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='!m-0 !text-lg'>Swap History</h2>
        {history.length > 0 && (
          <BaseButton size='small' type='text' onClick={onClear}>
            Clear
          </BaseButton>
        )}
      </div>

      {history.length === 0 ? (
        <Empty
          description='No swaps yet'
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <ul className='swap-history-list flex flex-col'>
          {history.map((item) => (
            <li
              key={item.id}
              role='button'
              tabIndex={0}
              onClick={() => onApply(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onApply(item);
                }
              }}
              className='group flex w-full items-center justify-between gap-3 py-3 px-2 -mx-2 rounded-xl border-b border-(--border) last:border-b-0 cursor-pointer transition-colors hover:bg-(--accent-bg)'
              aria-label={`Apply ${item.fromCurrency} to ${item.toCurrency} swap to the form`}
            >
              <Space size={4}>
                <TokenIcon symbol={item.fromCurrency} size={20} />
                <TokenIcon symbol={item.toCurrency} size={20} />
              </Space>
              <div className='flex-1 min-w-0'>
                <Text className='block truncate'>
                  {formatAmount(item.fromAmount)} {item.fromCurrency}
                  {' → '}
                  {formatAmount(item.toAmount)} {item.toCurrency}
                </Text>
                <Text type='secondary' className='text-xs'>
                  {formatTimestamp(item.timestamp)} · rate{' '}
                  {formatRate(item.rate)}
                </Text>
              </div>
              <RedoOutlined className='opacity-0 group-hover:opacity-60 transition-opacity' />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SwapHistory;
