import { useThemeColor } from '@/hooks/use-theme-color';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

export type ThemedTouchableViewProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTouchableView({ 
  style, 
  lightColor, 
  darkColor, 
  activeOpacity = 0.7,
  ...otherProps 
}: ThemedTouchableViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <TouchableOpacity 
      style={[{ backgroundColor }, style]} 
      activeOpacity={activeOpacity}
      {...otherProps} 
    />
  );
}