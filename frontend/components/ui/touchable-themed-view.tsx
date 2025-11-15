import { useThemeColor } from '@/hooks/use-theme-color';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

export type ThemeTouchableViewProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemeTouchableView({ 
  style, 
  lightColor, 
  darkColor, 
  activeOpacity = 0.7,
  ...otherProps 
}: ThemeTouchableViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <TouchableOpacity 
      style={[{ backgroundColor }, style]} 
      activeOpacity={activeOpacity}
      {...otherProps} 
    />
  );
}