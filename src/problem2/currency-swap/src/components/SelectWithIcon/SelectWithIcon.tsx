import { Select, Space, type SelectProps } from 'antd';
import TokenIcon from '@/components/TokenIcon/TokenIcon';

export interface TokenSelectOption {
  value: string;
  price: number;
}

interface SelectWithIconProps
  extends Omit<SelectProps, 'options' | 'value' | 'onChange' | 'filterOption'> {
  options: TokenSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
}

const SelectWithIcon = ({
  options,
  value,
  onChange,
  ...props
}: SelectWithIconProps) => {
  return (
    <Select
      showSearch
      value={value}
      onChange={onChange}
      optionLabelProp="label"
      popupMatchSelectWidth={260}
      filterOption={(input, option) =>
        String(option?.value ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      options={options.map((option) => ({
        value: option.value,
        label: (
          <Space size={8}>
            <TokenIcon symbol={option.value} />
            <span>{option.value}</span>
          </Space>
        ),
      }))}
      {...props}
    />
  );
};

export default SelectWithIcon;
