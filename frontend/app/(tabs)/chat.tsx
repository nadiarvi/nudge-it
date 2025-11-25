import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedTouchableView } from '@/components/ui/touchable-themed-view';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { NuggitIcon } from '@/components/icons/nuggit-icon';
import { ProfileIcon } from '@/components/icons/profile-icon';

import { useAuthStore } from '@/contexts/auth-context';
import axios from 'axios';

import { User } from '@/types/user';

import { formatDisplayName } from '@/utils/name-formatter';

export default function ChatScreen() {
  const { uid, groups } = useAuthStore();
  const gid = groups[0];
  //console.log(`chat screen ${uid} - ${gid}`);

  const [chatData, setChatData] = useState([]);

  const getAllChats = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/${gid}/${uid}`);
      const chats = res.data.chats;
      
      const _chatData = chats
                          .filter((chat: any) => chat.type === "user")
                          .map((chat: any) => {
                            const partner = chat.people.find((person: User) => person._id !== uid);
                            const latestMessage = chat.messages[chat.messages.length - 1]?.content || "No messages yet";

                            return {
                              id: chat._id,
                              name: partner?.first_name || 'Unknown User',
                              message: latestMessage,
                            };
                          });

      setChatData(_chatData);
      //console.log(`Successfully fetched ${chats.length} chats.`);
    } catch (error) {
      console.error('Error fetching chats:', error);
      //console.log('failed req: ', `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/${gid}/${uid}`);
    }
  }, [uid, gid]);

  useFocusEffect(
    useCallback(() => {
      getAllChats();
      return () => {};
    }, [getAllChats])
  );

  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleChatPress = (chat: { id: string; name: string }) => {
    router.push({
      pathname: '/chat-member', 
      params: { 
        cid: chat.id,
        name: chat.name,
      }
    });
};

  const MAX_LENGTH = 400;
  const displayChat = (chat: string) => {
    return chat.length > MAX_LENGTH ? chat.substring(0, MAX_LENGTH) + "..." : chat;
  }

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1">Chats</ThemedText>
      </ThemedView>

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
            <ThemedText type="H3">{formatDisplayName(item.name)}</ThemedText>
            <ThemedText type="Body3" style={styles.messagePreview} numberOfLines={1}>
              {/* {displayChat(item.message)} */}
              {item.message}
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
