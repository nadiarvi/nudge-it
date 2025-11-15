import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'outline' | 'hover';
  disabled?: boolean;
}

export function Button({ 
  children, 
  onPress, 
  style, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'hover':
        return styles.hoverButton;
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
      <ThemedText style={[styles.buttonText, { color: getTextColor() }]}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: Colors.light.tabIconDefault,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.tint,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hoverButton: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.blackSecondary,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});