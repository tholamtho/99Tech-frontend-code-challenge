import { Button, type ButtonProps } from 'antd';

const BaseButton = ({ children, ...props }: ButtonProps) => {
  return <Button {...props}>{children}</Button>;
};

export default BaseButton;
