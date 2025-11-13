import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
          headerBackgroundColor={{ light: '#FFF0E6', dark: '#3A2B1F' }}
          headerImage={
            <IconSymbol
              size={220}
              color="#FFA94D"
              name="person.crop.circle"
              style={styles.reactLogo}
            />
          }>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Home</ThemedText>
          </ThemedView>
          <ThemedText>Profile details and settings will appear here.</ThemedText>
        </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  
});
