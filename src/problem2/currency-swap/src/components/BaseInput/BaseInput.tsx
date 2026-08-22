import { Input, type InputProps } from 'antd';
import { sanitizeAmountInput } from '@/utils/numberValidation';

export interface BaseInputProps
  extends Omit<InputProps, 'onChange' | 'value'> {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * A text input constrained to decimal-amount input (digits + one decimal
 * point). Invalid keystrokes are silently discarded rather than reflected
 * and reverted, so the caret never jumps.
 */
const BaseInput = ({ value, onChange, ...props }: BaseInputProps) => {
  return (
    <Input
      inputMode="decimal"
      autoComplete="off"
      {...props}
      value={value}
      onChange={(event) => {
        const sanitized = sanitizeAmountInput(event.target.value);
        if (sanitized !== undefined) onChange?.(sanitized);
      }}
    />
  );
};

export default BaseInput;
