import axios from 'axios';
import Constants from 'expo-constants';
import { Image as ExpoImage } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon } from '@/components/icons/close-icon';
import { ThemedButton, ThemedText, ThemedTouchableView, ThemedView } from '@/components/ui';
import { ThemedTextInput } from '@/components/ui/themed-text-input';
import { useAuthStore } from '@/contexts/auth-context';

import { Colors } from '@/constants/theme';
import { User } from '@/types/user';
import { formatDisplayName } from '@/utils/name-formatter';


const API_BASE =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  console.error('API BASE URL IS MISSING');
}

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
  paddingVertical: RFValue(8),
  paddingHorizontal: RFValue(12),
  marginVertical: RFValue(4),
  borderRadius: RFValue(8),
  maxWidth: '75%',
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: RFValue(20),
  },
  flatListContent: {
    // paddingVertical: RFValue(12),
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: RFValue(24),
    paddingVertical: RFValue(12),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.light.cardBorder,
    backgroundColor: Colors.light.card,
  },
  textInput: {
    flex: 1,
    minHeight: RFValue(40),
    maxHeight: RFValue(120),
    marginRight: RFValue(10),
    paddingHorizontal: RFValue(12),
    borderRadius: RFValue(8),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.cardBorder,
    backgroundColor: Colors.light.background,
  },
  sendButton: {
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(8),
    borderRadius: RFValue(8),
    backgroundColor: Colors.light.tint,
  },
  sendButtonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
  },
  sticker: {
    width: RFValue(60),
    height: RFValue(60),
    position: 'absolute',
    bottom: RFValue(12),
    right: RFValue(24),
  },
  stickerTouchable: {
    position: 'absolute',
    bottom: RFValue(12),
    right: RFValue(24),
    zIndex: 1000,      
    elevation: 5,      
  },
  emptyState: {
    textAlign: 'center',
    marginTop: RFValue(20),
  },
});

const separatorStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.blackSecondary + '20',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: RFValue(4),
    paddingHorizontal: RFValue(12),
    borderRadius: RFValue(12),
    marginTop: RFValue(12),
  },
  text: {
    fontWeight: '600',
    color: Colors.light.blackSecondary,
  },
});

const chatBubbleStyles = StyleSheet.create({
  userContainer: {
    alignItems: 'flex-end',
  },
  partnerContainer: {
    alignItems: 'flex-start',
  },
  partnerBubble: {
    backgroundColor: Colors.light.cardBorder + '90',
  },
  userBubble: {
    backgroundColor: Colors.light.tint,
  },
  nuggetBubble: {
    backgroundColor: Colors.light.red,
  },
  partnerText: {
    color: Colors.light.text,
  },
  userText: {
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
    padding: RFValue(20),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
    paddingBottom: RFValue(32), // Extra padding for keyboard
  },
  title: {
    // marginBottom: RFValue(15),
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: Colors.light.cardBorder,
    // paddingBottom: RFValue(10),
  },
  label: {
    fontWeight: 'bold',
    marginTop: RFValue(15),
    marginBottom: RFValue(5),
    color: Colors.light.blackSecondary,
  },
  originalText: {
    backgroundColor: Colors.light.red + '10',
    padding: RFValue(10),
    borderRadius: RFValue(8),
  },
  suggestionText: {
    backgroundColor: Colors.light.tint + '10',
    padding: RFValue(10),
    borderRadius: RFValue(8),
    // fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RFValue(20),
  },
  button: {
    flex: 1,
    marginHorizontal: RFValue(5),
  },
});

// --- SMALL COMPONENTS ---
const TimeSeparator = ({ timestamp }: TimeSeparatorProps) => {
  const formattedTime = moment(timestamp).calendar(null, {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    lastWeek: 'MMM D',
    sameElse: 'MMM D',
  });

  return (
    <View style={separatorStyles.container}>
      <ThemedText type="Body2" style={separatorStyles.text}>
        {formattedTime}
      </ThemedText>
    </View>
  );
};

const UserChatBubble = ({ content }: ChatBubbleProps) => (
  <View style={chatBubbleStyles.userContainer}>
    <View style={[baseBubbleStyle, chatBubbleStyles.userBubble]}>
      <ThemedText type="Body1" style={chatBubbleStyles.userText}>
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
      <ThemedText type="Body1" style={chatBubbleStyles.partnerText}>
        {isNugget ? 'AI Assistant: ' : ''}
        {content}
      </ThemedText>
    </View>
  </View>
);

// --- MAIN SCREEN ---
export default function ChatDetailScreen() {
  const insets = useSafeAreaInsets();
  const { uid, groups } = useAuthStore();
  // const gid = groups[0];
  const gid = Array.isArray(groups) && groups.length > 0 ? groups[0] : null;

  const router = useRouter();
  // const { targetUid, targetUsername } = useLocalSearchParams();
  const { targetUid, targetUsername } = useLocalSearchParams<{
    targetUid?: string;
    targetUsername?: string;
  }>();

  const safeTargetUid = typeof targetUid === 'string' ? targetUid : '';
  const safeTargetUsername =
    typeof targetUsername === 'string' ? targetUsername : 'Chat';


  const [chatId, setChatId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMsg, setCurrentMsg] = useState<string>('');
  const [people, setPeople] = useState<User[]>([]);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionData, setRevisionData] = useState<RevisionData | null>(null);

  const fetchChatData = useCallback(async () => {
    if (!uid || !gid || !targetUid) return;

    const payload = {
      otherUserId: targetUid,
      groupId: gid,
      type: 'user',
    };

    try {
      const res = await axios.post(
        `${API_BASE}/api/chats/create/${uid}`,
        payload
      );

      const data = res.data;
      const chatData = data.existingChat || data.newChat;

      if (chatData?._id) {
        setChatId(chatData._id);
        setMessages(chatData.messages);
        setPeople(chatData.people);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  }, [targetUid, uid, gid]);

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]);

  // --- SEND MESSAGE ---
  const handleSend = async () => {
    const trimmed = currentMsg.trim();
    if (!trimmed || !uid || !chatId) return;

    setCurrentMsg('');

    try {
      const res = await axios.post(
        `${API_BASE}/api/chats/${chatId}/${uid}/user`,
        { content: trimmed }
      );

      const data = res.data;

      if (data.needsRevision) {
        setRevisionData({
          original: data.original,
          suggestion: data.suggestion,
          tempId: Date.now().toString(),
        });
        setShowRevisionModal(true);
      } else {
        const sentMessage = data.chat.messages[data.chat.messages.length - 1];
        setMessages((prev) => [...prev, sentMessage]);
      }
    } catch (error) {
      console.error('send error:', error);
      setCurrentMsg(trimmed);
    }
  };

  const handleSendOriginal = async () => {
    if (!revisionData) return;

    try {
      const res = await axios.post(
        `${API_BASE}/api/chats/${chatId}/${uid}/confirm`,
        { chosenContent: revisionData.original }
      );
      setMessages(res.data.chat.messages);
    } catch (error) {
      console.error('Error sending original:', error);
    }

    setShowRevisionModal(false);
    setRevisionData(null);
  };

  const handleChooseSuggestion = () => {
    setShowRevisionModal(false);
    setCurrentMsg(revisionData?.suggestion ?? '');
    setRevisionData(null);
  };

  // NAVIGATION
  const handleNuggitPress = () => {
    const otherPerson = people.find((p) => p._id !== uid);
    let otherUserId = otherPerson?._id || (targetUid as string);

    router.push({
      pathname: '/chatbot',
      params: {
        cid: chatId,
        people: JSON.stringify(people),
        otherUserId,
      },
    });
  };

  const shouldShowTimeSeparator = (currentMsg: Message, previousMsg: Message | null) => {
    if (!previousMsg) return true;

    const currentDay = moment(currentMsg.timestamp).startOf('day');
    const previousDay = moment(previousMsg.timestamp).startOf('day');

    return !currentDay.isSame(previousDay);
  };

  const renderChatHistory = (messages: Message[]) => {
    if (messages.length === 0) {
      return <ThemedText style={styles.emptyState}>Start chatting now!</ThemedText>;
    }

    const renderItem = ({ item, index }: { item: Message; index: number }) => {
      const previousMsg = index > 0 ? messages[index - 1] : null;
      const showSeparator = shouldShowTimeSeparator(item, previousMsg);

      const isMe = item.sender === uid;
      const isNugget = item.senderType === 'nugget';

      return (
        <View>
          {showSeparator && <TimeSeparator timestamp={item.timestamp} />}
          {isMe ? (
            <UserChatBubble content={item.content} />
          ) : (
            <PartnerChatBubble content={item.content} isNugget={isNugget} />
          )}
        </View>
      );
    };

    return (
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  // --- RENDER ---
  return (
    <>
      <Stack.Screen options={{ title: formatDisplayName(safeTargetUsername) }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.fullScreen}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        enabled
      >
        <ThemedView style={styles.container}>{renderChatHistory(messages)}</ThemedView>

        {/* Floating Button */}
        <TouchableOpacity 
          onPress={handleNuggitPress}
          style={[
            styles.stickerTouchable,
            {
              bottom: RFValue(12) + insets.bottom + RFValue(60),
            },
          ]}
          activeOpacity={0.7}  
        >
          <ExpoImage
            source={require('@/assets/images/nuggit-icon.png')}
            style={{             
              width: RFValue(60),
              height: RFValue(60),
            }}
            contentFit="contain"
            placeholder={require('@/assets/images/nuggit-icon-small.png')}
            transition={150}
          />
        </TouchableOpacity>

        {/* MESSAGE INPUT BAR */}
        <ThemedView
          style={[
            styles.textInputContainer,
            { paddingBottom: insets.bottom + RFValue(4)}
          ]}
        >
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

      {/* REVISION MODAL */}
      <Modal visible={showRevisionModal} transparent animationType="slide">
        <View style={revisionModalStyles.overlay}>
          <View style={revisionModalStyles.box}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText type="H2" style={revisionModalStyles.title}>
                Tone Suggestion
              </ThemedText>
              <TouchableOpacity onPress={() => setShowRevisionModal(false)}>
                <CloseIcon size={RFValue(24)} strokeWidth={RFValue(1.5)} color={Colors.light.text}/>
              </TouchableOpacity>
            </View>

            {revisionData && (
              <View>
                <ThemedText type="Body2" style={revisionModalStyles.label}>
                  Your original message:
                </ThemedText>
                <ThemedText style={revisionModalStyles.originalText} type='Body1'>
                  {revisionData.original}
                </ThemedText>

                <ThemedText type="Body2" style={revisionModalStyles.label}>
                  Suggested revision:
                </ThemedText>
                <ThemedText style={revisionModalStyles.suggestionText} type='Body1'>
                  {revisionData.suggestion}
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
