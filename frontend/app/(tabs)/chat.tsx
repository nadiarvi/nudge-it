import { IconSymbol } from '@/components/ui/icon-symbol';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function ChatScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E6F7FF', dark: '#083344' }}
      headerImage={
        <IconSymbol
          size={220}
          color="#6EA8FF"
          name="message.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Chat</ThemedText>
      </ThemedView>
      <ThemedText>Welcome to Chat — messages and conversations will appear here.</ThemedText>
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
