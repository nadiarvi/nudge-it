import { ThemedText, ThemedTouchableView, ThemedView } from '@/components/ui';
import { ThemedTextInput } from '@/components/ui/themed-text-input';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import axios from 'axios';
import Constants from 'expo-constants';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


// --- INTERFACES ---

interface Message {
  _id: string;
  content: string;
  sender: string;
  receiver?: string;
  senderType: 'user' | 'nugget';
  timestamp: string;
  type?: 'suggestion' | 'normal';
}

interface ChatBubbleProps {
  content: string;
  isNugget?: boolean;
}

interface TimeSeparatorProps {
  timestamp: string;
}

// --- SHARED BUBBLE STYLE (MATCH MEMBER CHAT) ---
const baseBubbleStyle = {
  paddingVertical: RFValue(8),
  paddingHorizontal: RFValue(12),
  marginVertical: RFValue(4),   // CHANGED from 8 → 4
  borderRadius: RFValue(8),
  maxWidth: '75%',
};

// --- TIME SEPARATOR ---
const TimeSeparator = ({ timestamp }: TimeSeparatorProps) => {
  const formattedTime = moment(timestamp).calendar(null, {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    lastWeek: 'MMM D',
    sameElse: 'MMM D'
  });

  return (
    <View style={separatorStyles.container}>
      <ThemedText type='Body2' style={separatorStyles.text}>
        {formattedTime}
      </ThemedText>
    </View>
  );
};

// --- BUBBLE COMPONENTS ---
const UserChatBubble = ({ content }: ChatBubbleProps) => (
  <View style={chatBubbleStyles.userContainer}>
    <View style={[baseBubbleStyle, chatBubbleStyles.userBubble]}>
      <ThemedText type='Body1' style={chatBubbleStyles.userText}>
        {content}
      </ThemedText>
    </View>
  </View>
);

const PartnerChatBubble = ({ content }: ChatBubbleProps) => (
  <View style={chatBubbleStyles.partnerContainer}>
    <View style={[baseBubbleStyle, chatBubbleStyles.nuggetBubble]}>
      <ThemedText type='Body1' style={chatBubbleStyles.partnerText}>
        {content}
      </ThemedText>
    </View>
  </View>
);

// --- MAIN SCREEN COMPONENT ---

export default function ChatbotScreen() {
  const { uid, groups } = useAuthStore();
  const gid = groups[0];
  const { cid, otherUserId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const API_BASE =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL ||
    process.env.EXPO_PUBLIC_API_BASE_URL;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [botCid, setBotCid] = useState<string | null>(null);

  const getChatHistory = async () => {
    const payload = {
      type: 'nugget',
      groupId: gid,
      otherUserId: otherUserId,
    };

    try {
      const res = await axios.post(`${API_BASE}/api/chats/create/${uid}`, payload);
      if (res.data?.existingChat?.messages) {
        setMessages(res.data.existingChat.messages);
        setBotCid(res.data.existingChat._id);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    getChatHistory();
  }, [uid, cid]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      sender: uid,
      content: trimmed,
      timestamp: moment().toISOString(),
      senderType: 'user',
      type: 'normal',
    };

    const waitingMsg: Message = {
      _id: 'waiting-' + Date.now().toString(),
      sender: 'nugget',
      content: 'Nugget is typing...',
      timestamp: moment().toISOString(),
      senderType: 'nugget',
      type: 'normal',
    };

    setMessages((prev) => [...prev, userMessage, waitingMsg]);
    setInputText('');
    setIsLoading(true);

    const getAIResponse = async () => {
      try {
        const res = await axios.post(
          `${API_BASE}/api/chats/${botCid}/${uid}/nugget`,
          { content: trimmed }
        );

        if (res.data?.chat?.messages) {
          const fullMsgs = res.data.chat.messages;
          setMessages(fullMsgs.reverse());
        }
      } catch (error) {
        console.error('Error fetching AI response:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getAIResponse();
  };

  const shouldShowTimeSeparator = (currentMsg: Message, previousMsg: Message | null) => {
    if (!previousMsg) return true;

    const currentDay = moment(currentMsg.timestamp).startOf('day');
    const previousDay = moment(previousMsg.timestamp).startOf('day');

    return !currentDay.isSame(previousDay);
  };

  const renderChatHistory = (messages: Message[]) => {
    if (!messages || messages.length === 0) {
      return (
        <ThemedText style={{ textAlign: 'center', marginTop: RFValue(20) }}>
          Ask Nugget a question!
        </ThemedText>
      );
    }

    return (
      <FlatList
        data={messages}
        renderItem={({ item, index }) => {
          const prev = index > 0 ? messages[index - 1] : null;
          const showSeparator = shouldShowTimeSeparator(item, prev);

          const isMe = item.sender === uid && item.senderType === 'user';

          return (
            <View>
              {showSeparator && <TimeSeparator timestamp={item.timestamp} />}
              {isMe ? (
                <UserChatBubble content={item.content} />
              ) : (
                <PartnerChatBubble content={item.content} />
              )}
            </View>
          );
        }}
        contentContainerStyle={styles.flatListContent} // MATCHES MEMBER CHAT
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Nuggit Coach' }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.fullScreen}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ThemedView style={styles.container}>{renderChatHistory(messages)}</ThemedView>

        {/* INPUT BAR */}
        <ThemedView style={[  styles.textInputContainer, { paddingBottom: insets.bottom + RFValue(8) } ]}>
          <ThemedTextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <ThemedTouchableView
            onPress={handleSend}
            style={styles.sendButton}
            disabled={!inputText.trim()}
          >
            <ThemedText style={styles.sendButtonText}>Send</ThemedText>
          </ThemedTouchableView>
        </ThemedView>
      </KeyboardAvoidingView>
    </>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: RFValue(24),
  },
  flatListContent: {
    // MATCH MEMBER → no vertical padding
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
});

// --- SEPARATOR (MATCH MEMBER CHAT) ---
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
    color: Colors.light.blackSecondary,
    fontWeight: '600',
  },
});

// --- BUBBLE COLORS (UNCHANGED, BOT STYLE) ---
const chatBubbleStyles = StyleSheet.create({
  userContainer: {
    alignItems: 'flex-end',
  },
  partnerContainer: {
    alignItems: 'flex-start',
  },
  nuggetBubble: {
    backgroundColor: Colors.light.cardBorder,
  },
  userBubble: {
    backgroundColor: Colors.light.red,
  },
  partnerText: {
    color: Colors.light.text,
  },
  userText: {
    color: Colors.light.background,
  },
});
