import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedTouchableView } from '@/components/ui/touchable-themed-view';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { NuggitIcon } from '@/components/icons/nuggit-icon';
import { ProfileIcon } from '@/components/icons/profile-icon';

import { useAuthStore } from '@/contexts/auth-context';
import axios from 'axios';

import { User } from '@/types/user';

import { PlusIcon } from '@/components/icons';
import { Colors } from '@/constants/theme';
import { formatDisplayName } from '@/utils/name-formatter';

export default function ChatScreen() {
  const { uid, groups } = useAuthStore();
  const gid = groups[0];
  const router = useRouter();

  const [chatData, setChatData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/groups/${gid}/members`);
      if (res.data && res.data.members) {
        const options = res.data.members.filter((member: User) => member._id !== uid);
        setMembers(options);
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  }

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
                              partner: partner,
                            };
                          });

      setChatData(_chatData);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }, [uid, gid]);

  useFocusEffect(
    useCallback(() => {
      getAllChats();
      fetchMembers();
      return () => {};
    }, [getAllChats])
  );
  
  const handleChatPress = (chat: { partner: User }) => {
    console.log(`param passed: `, chat);
    const otherUser = chat.partner;
    if (!otherUser) {
      console.error('No other user found in chat.');
      return;
    }

    router.push({
        pathname: '/chat-member',
        params: {
          targetUid: otherUser._id,
          targetUsername: otherUser.first_name,
        }
    });
  }

  const handleAddChat = () => {
    console.log('Navigating to Add Chat Screen');
    setIsModalOpen(true);
  }

  const handleCreateChat = () => {
    if (!selectedMember) {
      console.error('No member selected for chat creation.');
      return;
    }

    router.push({
      pathname: '/chat-member',
      params: {
        targetUid: selectedMember._id,
        targetUsername: selectedMember.first_name,
      }
    });

    setIsModalOpen(false);
  }

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1">Chats</ThemedText>
        <ThemedTouchableView onPress={handleAddChat}>
          <PlusIcon size={RFValue(22)} color={Colors.light.blackSecondary}/>
        </ThemedTouchableView>
      </ThemedView>

      {/* <ThemedView style={styles.separator}/> */}

      {chatData.length === 0 ? (
        <ThemedView style={{ alignItems: 'center', marginTop: RFValue(32) }}>
          <ThemedText style={{ color: Colors.light.blackSecondary }}>
            No chats available.
          </ThemedText>
        </ThemedView>
      ) : (
        chatData.map((item) => (
          <>
          <ThemedTouchableView 
            key={item.id} 
            style={styles.chatItem} 
            onPress={() => handleChatPress(item)}
          >
            {/* Icon */}
            {item.name === 'Nuggit' ? (
              <NuggitIcon size={RFValue(40)} />
            ) : (
              <ProfileIcon size={RFValue(40)} />
            )}

            {/* Chat Text */}
            <View style={styles.chatTextContainer}>
              <ThemedText type="H3">{formatDisplayName(item.name)}</ThemedText>
              <ThemedText type="Body3" style={styles.messagePreview} numberOfLines={1}>
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
          <ThemedView style={[
            styles.separator, {marginLeft: RFValue(40)}]}/>
          </>
        ))
      )}

      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={modalStyle.overlay}>
          <View style={modalStyle.container}>

            <ThemedText type="H2" style={modalStyle.title}>
              Choose a Member
            </ThemedText>

            <View style={modalStyle.listContainer}>
              {members.map((member) => (
                <TouchableOpacity
                  key={member._id}
                  style={[
                    modalStyle.item,
                    selectedMember?._id === member._id && modalStyle.itemSelected
                  ]}
                  onPress={() => setSelectedMember(member)}
                >
                  <ThemedText style={modalStyle.itemText}>
                    {member.first_name} {member.last_name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <View style={modalStyle.buttonRow}>
              <ThemedTouchableView
                style={modalStyle.cancelButton}
                onPress={() => setIsModalOpen(false)}
              >
                <ThemedText>Cancel</ThemedText>
              </ThemedTouchableView>

              <ThemedTouchableView
                style={modalStyle.confirmButton}
                onPress={handleCreateChat}
              >
                <ThemedText style={modalStyle.confirmButtonText}>
                  Start Chat
                </ThemedText>
              </ThemedTouchableView>
            </View>

          </View>
        </View>
      </Modal>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    height: RFValue(0.5),
    backgroundColor: '#CCCCCC',
    // marginVertical: RFValue(2),
  },
  searchInput: {
    height: RFValue(40),
    borderRadius: RFValue(8),
    paddingHorizontal: RFValue(12),
    backgroundColor: '#f0f0f0',
    color: '#000',
    marginBottom: RFValue(12),
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: RFValue(12),
    // borderBottomWidth: RFValue(0.5),
    // borderColor: '#ccc',
  },
  chatTextContainer: {
    flex: 1,
    gap: RFValue(4),
    marginLeft: RFValue(12),
  },
  messagePreview: {
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: RFValue(12),
    paddingHorizontal: RFValue(6),
    paddingVertical: RFValue(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontWeight: '600',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  }
});

const modalStyle = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  container: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: RFValue(12),
    padding: RFValue(16),
    alignItems: 'center',
  },

  title: {
    marginBottom: RFValue(12),
  },

  listContainer: {
    width: '100%',
    maxHeight: RFValue(300),
    marginBottom: RFValue(12),
  },

  item: {
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(12),
    borderRadius: RFValue(8),
    marginBottom: RFValue(6),
    backgroundColor: '#F3F4F6',
  },

  itemSelected: {
    backgroundColor: '#D1E8FF' + '50',
    borderColor: '#3B82F6' + '50',
    borderWidth: 1,
  },

  itemText: {
    fontSize: RFValue(14),
    textAlign: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: RFValue(8),
  },

  cancelButton: {
    flex: 1,
    paddingVertical: RFValue(10),
    borderRadius: RFValue(8),
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    marginRight: RFValue(6),
  },

  confirmButton: {
    flex: 1,
    paddingVertical: RFValue(10),
    borderRadius: RFValue(8),
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    marginLeft: RFValue(6),
  },

  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
