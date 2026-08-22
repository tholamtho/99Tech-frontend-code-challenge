import { Form, type FormProps } from 'antd';
import type { ReactNode } from 'react';

interface BaseFormProps extends FormProps {
  children?: ReactNode;
}

const BaseForm = ({ children, ...props }: BaseFormProps) => {
  return <Form {...props}>{children}</Form>;
};

export default BaseForm;
