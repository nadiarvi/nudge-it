import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  lightPlaceholderColor?: string;
  darkPlaceholderColor?: string;
  type?: 'default' | 'Body1' | 'Body2' | 'Body3';
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  lightPlaceholderColor,
  darkPlaceholderColor,
  type = 'default',
  placeholderTextColor,
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const defaultPlaceholderColor = useThemeColor(
    { light: lightPlaceholderColor, dark: darkPlaceholderColor }, 
    'tabIconDefault'
  );

  return (
    <TextInput
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === "Body1" ? styles.body1 : undefined,
        type === "Body2" ? styles.body2 : undefined,
        type === "Body3" ? styles.body3 : undefined,
        style,
      ]}
      placeholderTextColor={placeholderTextColor || defaultPlaceholderColor}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  body1: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  body2: {
    fontSize: 14,
    paddingVertical: 7,
    paddingHorizontal: 0,
  },
  body3: {
    fontSize: 12,
    paddingVertical: 7,
    paddingHorizontal: 0,
  },
});