import { CallIcon } from '@/components/icons';
import { ThemedText, ThemedView } from '@/components/ui';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function SplashScreen() {
  return (
    <ThemedView style={styles.container}>
      <CallIcon size={64} />
      <ThemedText type='H1'>Nudge It</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
