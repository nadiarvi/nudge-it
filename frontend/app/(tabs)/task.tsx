import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TasksScreen() {
  return (
   <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">CS473 Social Computing</ThemedText>
      </ThemedView>
      <ThemedView style={styles.separator}/>
      <ThemedText type="subtitle">DP3</ThemedText>
      <ThemedView style={styles.taskCard}>
        <ThemedText>Hi</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#CCCCCC',
    marginVertical: 2,
  },
  taskCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  }
});
