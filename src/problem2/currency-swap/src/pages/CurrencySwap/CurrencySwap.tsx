import { useCallback, useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Card, Form, Typography } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import BaseButton from '@/components/BaseButton/BaseButton';
import BaseForm from '@/components/BaseForm/BaseForm';
import BaseInput from '@/components/BaseInput/BaseInput';
import SelectWithIcon from '@/components/SelectWithIcon/SelectWithIcon';
import SwapFormSkeleton from '@/components/SwapFormSkeleton/SwapFormSkeleton';
import SwapHistory from '@/components/SwapHistory/SwapHistory';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import { useSwapHistory } from '@/hooks/useSwapHistory';
import { useTokenPrices } from '@/hooks/useTokenPrices';
import { formatAmount } from '@/utils/format';
import { isPositiveNumber } from '@/utils/numberValidation';
import type {
  IFromToDropDownListData,
  ISwapHistoryItem,
  ITokenDropdown,
} from '@/types/currency';
import { isEmpty, keys } from 'lodash';
import { CURRENCY_SWAP_FORM_ITEM_NAME } from '@/constants/currencySwap';

const { Title, Text } = Typography;

const SUBMIT_DELAY_MS = 500;
// Simulate for delay like saving to BE
const delay = (ms: number) => {
  new Promise<void>((resolve) => setTimeout(resolve, ms));
};

const CurrencySwap = () => {
  const { tokens, loading, handleGetInitPriceData } = useTokenPrices();
  const { history, addEntry, clearHistory } = useSwapHistory();
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Get initial data list when first mount
  useEffect(() => {
    handleGetInitPriceData();
  }, [handleGetInitPriceData]);

  // Default from currency will be first item in list
  const defaultFromCurrency = useMemo(() => {
    if (isEmpty(tokens) || !keys(tokens)[0]) {
      return '';
    }
    return keys(tokens)[0];
  }, [tokens]);
  // const fromCurrency = selectedFromCurrency || defaultFromCurrency;

  // Default from currency will be second item in list
  const defaultToCurrency = useMemo(() => {
    if (isEmpty(tokens) || !keys(tokens)[1]) {
      return '';
    }
    return keys(tokens)[1];
  }, [tokens]);

  // Calculate rate auto
  const rateCurrencyConverted = useCallback(
    (fromPrice: number, toPrice: number): number => {
      const rate = fromPrice && toPrice ? fromPrice / toPrice : 0;
      return rate;
    },
    [],
  );

  // Auto Calculate when form changes
  const handleCalculateChanges = () => {
    const { fromNumber, fromDropdownValue, toDropdownValue } =
      form.getFieldsValue();
    const fromPrice = tokens[fromDropdownValue]?.price;
    const toPrice = tokens[toDropdownValue]?.price;
    if (fromDropdownValue === toDropdownValue) {
      setErrorMessage('Please choose two different currencies.');
    } else {
      setErrorMessage('');
    }

    if (isNaN(Number(fromNumber)) || !fromPrice || !toPrice) {
      return;
    }
    const rate = rateCurrencyConverted(fromPrice, toPrice);

    form.setFieldValue(
      CURRENCY_SWAP_FORM_ITEM_NAME.TO_NUMBER,
      formatAmount(rate * fromNumber),
    );
  };

  // Set initial Value for form
  useEffect(() => {
    const currentFromDropdownValue = form.getFieldValue(
      CURRENCY_SWAP_FORM_ITEM_NAME.FROM_DROPDOWN_VALUE,
    );
    const currentToDropdownValue = form.getFieldValue(
      CURRENCY_SWAP_FORM_ITEM_NAME.TO_DROPDOWN_VALUE,
    );

    if (!currentToDropdownValue && !currentFromDropdownValue) {
      form.setFieldValue(
        CURRENCY_SWAP_FORM_ITEM_NAME.TO_DROPDOWN_VALUE,
        defaultToCurrency,
      );
      form.setFieldValue(
        CURRENCY_SWAP_FORM_ITEM_NAME.FROM_DROPDOWN_VALUE,
        defaultFromCurrency,
      );
    }
  }, [form, defaultFromCurrency, defaultToCurrency]);

  /**
   * Get token dropdown list of from/to token
   */
  const getFromToDropdownList = useCallback((): IFromToDropDownListData => {
    const fromOptionsList: ITokenDropdown[] = [];
    const toOptionsList: ITokenDropdown[] = [];

    // Return empty array if there is not any token existed
    if (isEmpty(tokens)) {
      return { fromOptionsList, toOptionsList };
    }

    const fromCurrency = form.getFieldValue(
      CURRENCY_SWAP_FORM_ITEM_NAME.FROM_DROPDOWN_VALUE,
    );
    const toCurrency = form.getFieldValue(
      CURRENCY_SWAP_FORM_ITEM_NAME.TO_DROPDOWN_VALUE,
    );
    // Loop every item inside tokens, then get from/to dropdown list
    Object.keys(tokens).forEach((key: string) => {
      const { price } = tokens[key];
      if (![fromCurrency, toCurrency].includes(key)) {
        fromOptionsList.push({ value: key, price });
        toOptionsList.push({ value: key, price });
        return;
      }

      if (key === fromCurrency) {
        fromOptionsList.push({ value: key, price });
        return;
      }
      toOptionsList.push({ value: key, price });
    });

    return { fromOptionsList, toOptionsList };
  }, [tokens, form]);

  // Toggle 2 currency calculation
  const handleFlip = () => {
    const { fromDropdownValue, toDropdownValue } = form.getFieldsValue();
    const oldFromValue = fromDropdownValue;
    const oldToValue = toDropdownValue;
    form.setFieldValue(
      CURRENCY_SWAP_FORM_ITEM_NAME.FROM_DROPDOWN_VALUE,
      oldToValue,
    );
    form.setFieldValue(
      CURRENCY_SWAP_FORM_ITEM_NAME.TO_DROPDOWN_VALUE,
      oldFromValue,
    );
    handleCalculateChanges();
  };

  // Swap between from/to
  const handleSwap = async () => {
    const { fromNumber, fromDropdownValue, toNumber, toDropdownValue } =
      form.getFieldsValue();
    const removeFormatNumber = String(toNumber).replaceAll(',', '').trim();
    if (isNaN(Number(fromNumber)) || isNaN(Number(removeFormatNumber))) {
      return;
    }
    const rate = rateCurrencyConverted(
      Number(fromNumber),
      Number(removeFormatNumber),
    );
    const canSubmit =
      fromDropdownValue !== toDropdownValue &&
      isPositiveNumber(fromNumber) &&
      Boolean(rate);

    if (!canSubmit || !rate) {
      return;
    }

    setSubmitting(true);
    await delay(SUBMIT_DELAY_MS);
    addEntry({
      fromCurrency: fromDropdownValue,
      toCurrency: toDropdownValue,
      fromAmount: Number(fromNumber),
      toAmount: Number(removeFormatNumber),
      rate,
    });
    message.success(
      `Swapped ${formatAmount(Number(fromNumber))} ${fromDropdownValue} for ${formatAmount(Number(removeFormatNumber))} ${toDropdownValue}`,
    );
    form.resetFields([CURRENCY_SWAP_FORM_ITEM_NAME.FROM_NUMBER]);

    setSubmitting(false);
  };

  // Apply history to current calculation
  const handleApplyHistory = (item: ISwapHistoryItem) => {
    form.setFieldValue(
      CURRENCY_SWAP_FORM_ITEM_NAME.FROM_DROPDOWN_VALUE,
      item.fromCurrency,
    );
    form.setFieldValue(
      CURRENCY_SWAP_FORM_ITEM_NAME.TO_DROPDOWN_VALUE,
      item.toCurrency,
    );

    form.setFieldValue(
      CURRENCY_SWAP_FORM_ITEM_NAME.FROM_NUMBER,
      String(item.fromAmount),
    );

    handleCalculateChanges();

    message.info(
      `Loaded ${item.fromCurrency} → ${item.toCurrency} from history`,
    );
  };

  // Auto re-calculating when input changes
  const handleFormValuesChanges = () => {
    handleCalculateChanges();
  };

  return (
    <div className='min-h-screen flex flex-col items-center px-4 py-10 md:py-16'>
      <div className='w-full max-w-xl flex items-center justify-between mb-6'>
        <div>
          <Title level={2} className='!m-0'>
            Currency Swap
          </Title>
          <Text type='secondary'>Swap tokens at live reference prices</Text>
        </div>
        <ThemeToggle />
      </div>

      <Card className='w-full max-w-xl' variant='borderless'>
        {loading ? (
          <SwapFormSkeleton />
        ) : (
          <BaseForm
            form={form}
            name='swapCurrencyForm'
            layout='vertical'
            onValuesChange={handleFormValuesChanges}
            onFinish={handleSwap}
          >
            <div className='rounded-2xl border border-(--border) p-4'>
              <Text type='secondary' className='text-xs'>
                Amount to send
              </Text>
              <div className='flex items-center gap-3 mt-2'>
                <Form.Item
                  className='flex-1 text-right'
                  name={CURRENCY_SWAP_FORM_ITEM_NAME.FROM_NUMBER}
                >
                  <BaseInput
                    size='large'
                    placeholder='0.0'
                    status={errorMessage ? 'error' : undefined}
                  />
                </Form.Item>
                <Form.Item
                  name={CURRENCY_SWAP_FORM_ITEM_NAME.FROM_DROPDOWN_VALUE}
                  className='w-[132px] shrink-0'
                >
                  <SelectWithIcon
                    options={getFromToDropdownList().fromOptionsList}
                  />
                </Form.Item>
              </div>
            </div>

            <div className='flex justify-center -my-3 relative z-10'>
              <BaseButton
                shape='circle'
                icon={<SwapOutlined rotate={90} />}
                onClick={handleFlip}
                aria-label='Flip currencies'
              />
            </div>

            <div className='rounded-2xl border border-(--border) p-4'>
              <Text type='secondary' className='text-xs'>
                Amount to receive
              </Text>
              <div className='flex items-center gap-3 mt-2'>
                <Form.Item
                  className='flex-1 text-right'
                  name={CURRENCY_SWAP_FORM_ITEM_NAME.TO_NUMBER}
                >
                  <BaseInput size='large' placeholder='0.0' readOnly disabled />
                </Form.Item>
                <Form.Item
                  name={CURRENCY_SWAP_FORM_ITEM_NAME.TO_DROPDOWN_VALUE}
                  className='w-[132px] shrink-0'
                >
                  <SelectWithIcon
                    options={getFromToDropdownList().toOptionsList}
                  />
                </Form.Item>
              </div>
            </div>

            <div className='min-h-[22px] mt-3'>
              {errorMessage && (
                <Text type='danger' className='text-sm'>
                  {errorMessage}
                </Text>
              )}
            </div>

            <BaseButton
              type='primary'
              htmlType='submit'
              size='large'
              block
              loading={submitting}
              className='mt-2'
            >
              CONFIRM SWAP
            </BaseButton>
          </BaseForm>
        )}
      </Card>

      <SwapHistory
        history={history}
        onClear={clearHistory}
        onApply={handleApplyHistory}
      />
    </div>
  );
};

export default CurrencySwap;
