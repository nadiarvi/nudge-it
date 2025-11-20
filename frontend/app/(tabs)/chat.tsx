import { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedTouchableView } from '@/components/ui/touchable-themed-view';
import ParallaxScrollView from '@/components/ui/parallax-scroll-view'; 
import { useRouter } from 'expo-router';

import { ProfileIcon } from '@/components/icons/profile-icon';
import { NuggitIcon } from '@/components/icons/nuggit-icon';

const [chatData, setChatData] = useState([
  { id: '1', name: 'Adel', message: 'You: How is your progress? :D' },
  { id: '2', name: 'Nadia', message: 'You: Could you check my part please?' },
  { id: '3', name: 'Chian Ye', message: 'This part is a bit ugly TT', unread: true },
  { id: '4', name: 'Nuggit', message: 'By phrasing it like this, we can avoid any m...' },
]);

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


  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1">Chats</ThemedText>
      </ThemedView>
      <ThemedView style={styles.separator} />

      <TextInput
        style={styles.searchInput}
        placeholder="Search chats..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <ThemedTouchableView style={styles.chatItem} onPress={() => handleChatPress(item)}>
            
            {item.name === 'Nuggit' ? (
              <NuggitIcon size={40} />
            ) : (
              <ProfileIcon size={40} />
            )}

            {/* Chat Text */}
            <View style={styles.chatTextContainer}>
              <ThemedText type="Body1">{item.name}</ThemedText>
              <ThemedText type="Body3" style={styles.messagePreview}>{item.message}</ThemedText>
            </View>

            {/* Unread Badge */}
            {item.unread && (
              <View style={styles.unreadBadge}>
                <ThemedText type="Body3" style={styles.unreadText}>1</ThemedText>
              </View>
            )}
          </ThemedTouchableView>
        )}
      />
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
