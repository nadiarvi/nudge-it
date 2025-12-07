import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

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
    fontSize: RFValue(16),
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(0),
  },
  body1: {
    fontSize: RFValue(16),
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(0),
  },
  body2: {
    fontSize: RFValue(14),
    paddingVertical: RFValue(11),
    paddingHorizontal: RFValue(0),
  },
  body3: {
    fontSize: RFValue(12),
    paddingVertical: RFValue(9),
    paddingHorizontal: RFValue(0),
  },
});
