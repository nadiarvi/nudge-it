import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import { ReactElement, ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

interface ThemedButtonProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'outline' | 'hover' | 'menu';
  disabled?: boolean;
  icon?: ReactElement;
}

export function ThemedButton({ 
  children, 
  onPress, 
  style, 
  variant = 'primary',
  disabled = false,
  icon
}: ThemedButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'hover':
        return styles.hoverButton;
      case 'menu':
        return styles.menuButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline':
        return Colors.light.tint;
      case 'hover':
        return Colors.light.blackSecondary;
      case 'menu':
        return Colors.light.background;
      default:
        return '#FFFFFF';
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyle(),
        style,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {typeof children === 'string' ? (
        <View style={styles.buttonContent}>
          {icon}
          <ThemedText style={[styles.buttonText, { color: getTextColor() }]} type='Body2'>
            {children}
          </ThemedText>
        </View>
      ) : (
        children
      )}
    </Pressable>
  );
}

const PADDING_HORIZONTAL = 12;
const PADDING_VERTICAL = 8;
const BORDER_RADIUS = 8;

const baseButtonStyle = {
  paddingHorizontal: PADDING_HORIZONTAL,
  paddingVertical: PADDING_VERTICAL,
  borderRadius: BORDER_RADIUS,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const styles = StyleSheet.create({
  basicButton: baseButtonStyle,
  primaryButton: {
    ...baseButtonStyle,
    backgroundColor: Colors.light.tint,
  },
  secondaryButton: {
    ...baseButtonStyle,
    backgroundColor: Colors.light.tabIconDefault,
  },
  outlineButton: {
    ...baseButtonStyle,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  hoverButton: {
    ...baseButtonStyle,
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.blackSecondary,
    borderWidth: 1,
  },
  menuButton: {
    ...baseButtonStyle,
    backgroundColor: Colors.light.cardBorder,
    borderColor: Colors.light.cardBorder,
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});