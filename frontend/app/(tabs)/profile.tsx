import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1">Profile</ThemedText>
      </ThemedView>
      <ThemedText>This is the page for profile</ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -40,
    left: -10,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
