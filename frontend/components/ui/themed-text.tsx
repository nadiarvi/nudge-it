import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'H1' | 'H2' | 'Body1' | 'Body2' | 'Body3';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === "H1" ? styles.h1 : undefined,
        type === "H2" ? styles.h2 : undefined,
        type === "Body1" ? styles.body1 : undefined,
        type === "Body2" ? styles.body2 : undefined,
        type === "Body3" ? styles.body3 : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  h1 : {
    lineHeight: 1.4 * 24,
    fontSize: 24,
    fontWeight: '700',
  },
  h2: {
    lineHeight: 1 * 20,
    fontSize: 20,
    fontWeight: '600',
  },
  body1: {
    lineHeight: 1 * 16,
    fontSize: 16,
    fontWeight: '400',
  },
  body2: {
    lineHeight: 1 * 14,
    fontSize: 14,
  },
  body3: {
    lineHeight: 1 * 12,
    fontSize: 12,
  },
});