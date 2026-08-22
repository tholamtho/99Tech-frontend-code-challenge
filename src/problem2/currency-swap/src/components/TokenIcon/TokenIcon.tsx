import { useState } from 'react';
import { Avatar } from 'antd';
import { getTokenIconUrl } from '@/utils/tokenIcon';

interface TokenIconProps {
  symbol: string;
  size?: number;
}

/** Renders a token's icon from the Switcheo token-icons repo, falling back
 * to a lettered avatar when a token has no matching icon. */
const TokenIcon = ({ symbol, size = 22 }: TokenIconProps) => {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <Avatar size={size} style={{ fontSize: size * 0.45, flexShrink: 0 }}>
        {symbol.slice(0, 2)}
      </Avatar>
    );
  }

  return (
    <img
      src={getTokenIconUrl(symbol)}
      alt={symbol}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      style={{ borderRadius: '50%', flexShrink: 0, display: 'block' }}
    />
  );
};

export default TokenIcon;
