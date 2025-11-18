import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ProfileIcon } from '@/components/icons/profile-icon';

interface NuggitIconProps {
  size?: number;
}

export function NuggitIcon({ size = 50 }: NuggitIconProps) {
  return (
    <View style={{ width: size, height: size }}>
      {/* Default profile icon */}
      <ProfileIcon size={size} />

      {/* Nuggit image overlay (centered, default size) */}
      <Image
        source={require('@/assets/images/nuggit-icon.png')}
        style={styles.overlay}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -0.5 * 37 }, // 👈 replace 37 with your image’s natural width
      { translateY: -0.5 * 50 }, // 👈 replace 50 with your image’s natural height
    ],
    width: 37,   // 👈 use your image’s default width
    height: 50,  // 👈 use your image’s default height
  },
});

