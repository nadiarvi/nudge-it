import { StyleSheet, Text, type TextProps } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'H1' | 'H2' | 'H3' | 'Body1' | 'Body2' | 'Body3';
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
        type === "H3" ? styles.h3 : undefined,
        type === "Body1" ? styles.body1 : undefined,
        type === "Body2" ? styles.body2 : undefined,
        type === "Body3" ? styles.body3 : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

// const styles = StyleSheet.create({
//   default: {
//     fontSize: RFValue(16),
//     lineHeight: RFValue(24), // Kept base lineHeight at 1.5x
//   },
//   h1 : {
//     lineHeight: RFValue(38), // ~1.25 * 30
//     fontSize: RFValue(30),
//     fontWeight: '700',
//   },
//   h2: {
//     lineHeight: RFValue(30), // ~1.35 * 22
//     fontSize: RFValue(22),
//     fontWeight: '600',
//   },
//   h3: {
//     lineHeight: RFValue(24),
//     fontSize: RFValue(18),
//     fontWeight: '600',
//   },
//   body1: {
//     lineHeight: RFValue(24), // 1.5 * 16
//     fontSize: RFValue(16),
//     fontWeight: '500',
//   },
//   body2: {
//     lineHeight: RFValue(22), // ~1.5 * 15
//     fontSize: RFValue(16),
//   },
//   body3: {
//     lineHeight: RFValue(1.4 * 16), // ~1.4 * 14
//     fontSize: RFValue(16),
//   },
// });


// // NEW STYLES
// const styles = StyleSheet.create({
//   default: {
//     fontSize: RFValue(15),
//     lineHeight: RFValue(20),
//   },
//   h1: {
//     fontSize: RFValue(24),
//     lineHeight: RFValue(30),
//     fontWeight: '700',
//   },
//   h2: {
//     fontSize: RFValue(20),
//     lineHeight: RFValue(26),
//     fontWeight: '600',
//   },
//   h3: {
//     fontSize: RFValue(16),
//     lineHeight: RFValue(22),
//     fontWeight: '600',
//   },
//   body1: {
//     fontSize: RFValue(15),
//     lineHeight: RFValue(20),
//     fontWeight: '500',
//   },
//   body2: {
//     fontSize: RFValue(14),
//     lineHeight: RFValue(18),
//   },
//   body3: {
//     fontSize: RFValue(12.5),
//     lineHeight: RFValue(16),
//   },
// });

const styles = StyleSheet.create({
  default: {
    fontSize: RFValue(15),
    lineHeight: RFValue(20),
  },
  h1: {
    fontSize: RFValue(20),   // OLD H2
    lineHeight: RFValue(26),
    fontWeight: '700',
  },
  h2: {
    fontSize: RFValue(18),   // NEW BETWEEN SIZE
    lineHeight: RFValue(24),
    fontWeight: '600',
  },
  h3: {
    fontSize: RFValue(16),   // unchanged
    lineHeight: RFValue(22),
    fontWeight: '600',
  },
  body1: {
    fontSize: RFValue(15),
    lineHeight: RFValue(20),
    fontWeight: '500',
  },
  body2: {
    fontSize: RFValue(14),
    lineHeight: RFValue(18),
  },
  body3: {
    fontSize: RFValue(12.5),
    lineHeight: RFValue(16),
  },
});
