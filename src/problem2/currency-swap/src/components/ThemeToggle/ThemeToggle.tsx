import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import BaseButton from '@/components/BaseButton/BaseButton';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <BaseButton
      shape="circle"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
    />
  );
};

export default ThemeToggle;
