import { ThemedButton, ThemedText, ThemedTouchableView, ThemedView } from '@/components/ui';
import { ThemedTextInput } from '@/components/ui/themed-text-input';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import { User } from '@/types/user';
import { formatDisplayName } from '@/utils/name-formatter';
import axios from 'axios';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

// --- INTERFACES ---

interface Message {
  _id: string;
  content: string;
  sender: string | null;
  receiver: string | null;
  senderType: 'user' | 'nugget';
  timestamp: string;
}

interface ChatBubbleProps {
  content: string;
  isNugget?: boolean;
}

interface TimeSeparatorProps {
  timestamp: string;
}

interface RevisionData {
  original: string;
  suggestion: string;
  tempId: string;
}

// --- STYLES ---

const baseBubbleStyle = {
  paddingVertical: 8,
  paddingHorizontal: 12,
  marginVertical: 8,
  borderRadius: 8,
  maxWidth: '75%',
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  flatListContent: {
    paddingVertical: 12,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.light.cardBorder,
    backgroundColor: Colors.light.card,
    paddingBottom: 24,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    marginRight: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.cardBorder,
    backgroundColor: Colors.light.background,
  },
  sendButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.tint,
  },
  sendButtonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
  },
  sticker: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 12,
    right: 24,
  },
  emptyState: {
    textAlign: 'center',
    marginTop: 20,
  },
});

const separatorStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.blackSecondary,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: Colors.light.background,
  },
});

const chatBubbleStyles = StyleSheet.create({
  userContainer: {
    alignItems: 'flex-end',
  },
  partnerContainer: {
    alignItems: 'flex-start',
  },
  userBubble: {
    backgroundColor: Colors.light.cardBorder,
  },
  partnerBubble: {
    backgroundColor: Colors.light.tint,
  },
  nuggetBubble: {
    backgroundColor: Colors.light.red,
  },
  userText: {
    color: Colors.light.text,
  },
  partnerText: {
    color: Colors.light.background,
  },
});

const revisionModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  box: {
    backgroundColor: Colors.light.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    marginBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.cardBorder,
    paddingBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: Colors.light.blackSecondary,
  },
  originalText: {
    backgroundColor: Colors.light.red + '10',
    padding: 10,
    borderRadius: 8,
  },
  suggestionText: {
    backgroundColor: Colors.light.tint + '10',
    padding: 10,
    borderRadius: 8,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

// --- SMALLER FUNCTIONAL COMPONENTS ---

const TimeSeparator = ({ timestamp }: TimeSeparatorProps) => {
  const formattedTime = moment(timestamp).calendar(null, {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    lastWeek: 'MMM D',
    sameElse: 'MMM D',
  });

  return (
    <View style={separatorStyles.container}>
      <ThemedText type="Body3" style={separatorStyles.text}>
        {formattedTime}
      </ThemedText>
    </View>
  );
};

const UserChatBubble = ({ content }: ChatBubbleProps) => (
  <View style={chatBubbleStyles.userContainer}>
    <View style={[baseBubbleStyle, chatBubbleStyles.userBubble]}>
      <ThemedText type="Body3" style={chatBubbleStyles.userText}>
        {content}
      </ThemedText>
    </View>
  </View>
);

const PartnerChatBubble = ({ content, isNugget = false }: ChatBubbleProps) => (
  <View style={chatBubbleStyles.partnerContainer}>
    <View
      style={[
        baseBubbleStyle,
        isNugget ? chatBubbleStyles.nuggetBubble : chatBubbleStyles.partnerBubble,
      ]}
    >
      <ThemedText type="Body3" style={chatBubbleStyles.partnerText}>
        {isNugget ? 'AI Assistant: ' : ''}
        {content}
      </ThemedText>
    </View>
  </View>
);

// --- MAIN SCREEN COMPONENT ---

export default function ChatDetailScreen() {
  const { uid, groups } = useAuthStore();
  const gid = groups[0];
  const router = useRouter();
  const { targetUid, targetUsername } = useLocalSearchParams();

  const [chatId, setChatId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMsg, setCurrentMsg] = useState<string>('');
  const [people, setPeople] = useState<User[]>([]);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionData, setRevisionData] = useState<RevisionData | null>(null);

  const fetchChatData = useCallback(async () => {
    const payload = {
      otherUserId: targetUid,
      groupId: gid,
      type: 'user',
    };

    try {
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/create/${uid}`, payload);
      const data = res.data;
      
      let chatData;
      if (data.existingChat) chatData = data.existingChat;
      if (data.newChat) chatData = data.newChat;

      if (chatData && chatData._id) {
        setChatId(chatData._id);
        setMessages(chatData.messages.reverse());
        setPeople(chatData.people);
      }
    } catch (error) {
      console.error('Error creating or getting chat:', error);
      console.error('Failed request:', `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/create/${uid}`);
      console.error('With payload:', payload);
    }
  }, [targetUid, uid, gid]);

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]);

  // --- MESSAGE HANDLERS ---

  const handleSend = async () => {
    const trimmed = currentMsg.trim();
    const activeChatId = chatId;

    if (!trimmed || !uid || !activeChatId) {
      if (!activeChatId) {
        Alert.alert('Error', 'Chat is not initialized. Try again.');
      }
      return;
    }

    setCurrentMsg('');
    const tempId = Date.now().toString();

    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/${activeChatId}/${uid}/user`,
        { content: trimmed }
      );

      const data = res.data;

      if (data.needsRevision === true) {
        setRevisionData({
          original: data.original,
          suggestion: data.suggestion,
          tempId: tempId,
        });
        setShowRevisionModal(true);
      } else {
        const sentMessage = data.chat.messages[data.chat.messages.length - 1];

        const finalMessage: Message = {
          _id: sentMessage._id,
          sender: sentMessage.sender,
          content: sentMessage.content,
          timestamp: sentMessage.timestamp,
          senderType: sentMessage.senderType,
          receiver: sentMessage.receiver,
        };

        setMessages((prev) => [...prev, finalMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.log(`chatId: ${activeChatId}, uid: ${uid}`);
      console.error(
        'Failed request:',
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/${activeChatId}/${uid}/user`
      );
      setCurrentMsg(trimmed);
      Alert.alert('Error', 'Could not send message due to a server error.');
    }
  };

  const handleSendOriginal = async () => {
    if (!revisionData) return;

    console.log('Sending original message:', revisionData.original);

    const activeChatId = chatId || cid;

    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/${activeChatId}/${uid}/confirm`,
        { chosenContent: revisionData.original }
      );
      setMessages(res.data.chat.messages);
    } catch (error) {
      console.error('Error sending original message:', error);
      console.error(
        'Failed request:',
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/${activeChatId}/${uid}/confirm`
      );
      Alert.alert('Error', 'Could not send message.');
    }

    setShowRevisionModal(false);
    setRevisionData(null);
  };

  const handleChooseSuggestion = () => {
    setShowRevisionModal(false);
    setCurrentMsg(revisionData?.suggestion ?? '');
    setRevisionData(null);
  };

  // --- NAVIGATION HANDLERS ---

  const handleNuggitPress = () => {
    if (!uid) {
      console.error('Current user ID (uid) is missing.');
      return;
    }

    const otherPerson = people.find((person) => person._id !== uid);
    let otherUserId: string | undefined = otherPerson?._id;

    // Fallback to targetUserId from URL params if not found in people
    if (!otherUserId && targetUid) {
      otherUserId = targetUid as string;
    }

    if (!otherUserId) {
      console.error("Could not determine the other user's ID.");
      Alert.alert('Error', 'Could not identify the recipient for the AI assistant.');
      return;
    }

    const activeChatId = chatId;

    router.push({
      pathname: '/chatbot',
      params: {
        cid: activeChatId,
        people: JSON.stringify(people),
        otherUserId: otherUserId,
      },
    });
  };

  // --- RENDER HELPERS ---

  const shouldShowTimeSeparator = (currentMsg: Message, previousMsg: Message | null): boolean => {
    if (!previousMsg) return true;

    const currentDay = moment(currentMsg.timestamp).startOf('day');
    const previousDay = moment(previousMsg.timestamp).startOf('day');

    return !currentDay.isSame(previousDay);
  };

  const renderChatHistory = (messages: Message[]) => {
    if (!messages || messages.length === 0) {
      return (
        <ThemedText style={styles.emptyState}>Start chatting now!</ThemedText>
      );
    }

    const renderItem = ({ item, index }: { item: Message; index: number }) => {
      const previousMsg = index > 0 ? messages[index - 1] : null;
      const showSeparator = shouldShowTimeSeparator(item, previousMsg);

      const isMe = item.sender === uid;
      const isNugget = item.senderType === 'nugget';

      let chatBubble;

      if (isMe) {
        chatBubble = <UserChatBubble content={item.content} />;
      } else {
        chatBubble = <PartnerChatBubble content={item.content} isNugget={isNugget} />;
      }

      return (
        <View>
          {showSeparator && <TimeSeparator timestamp={item.timestamp} />}
          {chatBubble}
        </View>
      );
    };

    return (
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContent}
      />
    );
  };

  // --- MAIN RENDER ---

  return (
    <>
      <Stack.Screen options={{ title: formatDisplayName(targetUsername) }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.fullScreen}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ThemedView style={styles.container}>{renderChatHistory(messages)}</ThemedView>

        {/* Floating Nuggit Button */}
        <TouchableOpacity onPress={handleNuggitPress}>
          <Image
            source={require('@/assets/images/nuggit-icon.png')}
            style={styles.sticker}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Message Input */}
        <ThemedView style={styles.textInputContainer}>
          <ThemedTextInput
            style={styles.textInput}
            placeholder="Type your message here..."
            value={currentMsg}
            onChangeText={setCurrentMsg}
            multiline
          />
          <ThemedTouchableView
            onPress={handleSend}
            style={styles.sendButton}
            disabled={!currentMsg.trim()}
          >
            <ThemedText style={styles.sendButtonText}>Send</ThemedText>
          </ThemedTouchableView>
        </ThemedView>
      </KeyboardAvoidingView>

      {/* Revision Modal */}
      <Modal visible={showRevisionModal} transparent animationType="slide">
        <View style={revisionModalStyles.overlay}>
          <View style={revisionModalStyles.box}>
            <ThemedText type="H3" style={revisionModalStyles.title}>
              Tone Suggestion
            </ThemedText>

            {revisionData && (
              <View>
                <ThemedText type="Body2" style={revisionModalStyles.label}>
                  Your original message:
                </ThemedText>
                <ThemedText style={revisionModalStyles.originalText}>
                  "{revisionData.original}"
                </ThemedText>

                <ThemedText type="Body2" style={revisionModalStyles.label}>
                  Suggested revision:
                </ThemedText>
                <ThemedText style={revisionModalStyles.suggestionText}>
                  "{revisionData.suggestion}"
                </ThemedText>

                <View style={revisionModalStyles.buttonRow}>
                  <ThemedButton
                    variant="secondary"
                    onPress={handleSendOriginal}
                    style={revisionModalStyles.button}
                  >
                    Send Original
                  </ThemedButton>

                  <ThemedButton
                    variant="primary"
                    onPress={handleChooseSuggestion}
                    style={revisionModalStyles.button}
                  >
                    Use Suggestion
                  </ThemedButton>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}