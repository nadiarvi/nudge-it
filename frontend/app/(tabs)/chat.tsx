import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedTouchableView } from '@/components/ui/touchable-themed-view';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { NuggitIcon } from '@/components/icons/nuggit-icon';
import { ProfileIcon } from '@/components/icons/profile-icon';

const SAMPLE_LONG_MSG = `
Hey, I just wanted to check in and see how things are going with the project.
Let me know if you need any help or have any questions. Looking forward to hearing from you soon!
`;

const chatData = [
  { id: '1', name: 'Adel', message: 'You: How is your progress? :D' },
  { id: '2', name: 'Nadia', message: 'You: Could you check my part please?' },
  { id: '3', name: 'Chian Ye', message: 'This part is a bit ugly TT', unread: true },
  { id: '4', name: 'Nuggit', message: SAMPLE_LONG_MSG },
];

export default function ChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredChats = chatData.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat: { id: string; name: string }) => {
    router.push(`/chat1?name=${encodeURIComponent(chat.name)}`);
  };

  const MAX_LENGTH = 45;
  const displayChat = (chat: string) => {
    return chat.length > MAX_LENGTH ? chat.substring(0, MAX_LENGTH) + "..." : chat;
  }

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1">Chats</ThemedText>
      </ThemedView>
      {/* <ThemedView style={styles.separator} /> */}

      {/* <TextInput
        style={styles.searchInput}
        placeholder="Search chats..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      /> */}

      {chatData.map((item) => (
        <ThemedTouchableView 
          key={item.id} 
          style={styles.chatItem} 
          onPress={() => handleChatPress(item)}
        >
          {item.name === 'Nuggit' ? (
            <NuggitIcon size={40} />
          ) : (
            <ProfileIcon size={40} />
          )}

          {/* Chat Text */}
          <View style={styles.chatTextContainer}>
            <ThemedText type="Body1">{item.name}</ThemedText>
            <ThemedText type="Body3" style={styles.messagePreview}>
              {displayChat(item.message)}
            </ThemedText>
          </View>

          {/* Unread Badge */}
          {item.unread && (
            <View style={styles.unreadBadge}>
              <ThemedText type="Body3" style={styles.unreadText}>1</ThemedText>
            </View>
          )}
        </ThemedTouchableView>
      ))}
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
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    color: '#000',
    marginBottom: 12,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  chatTextContainer: {
    flex: 1,
    gap: 4,
    marginLeft: 12,
  },
  messagePreview: {
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontWeight: '600',
  },
});
