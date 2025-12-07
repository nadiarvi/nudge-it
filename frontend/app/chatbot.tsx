import { ThemedText, ThemedTouchableView, ThemedView } from '@/components/ui';
import { ThemedTextInput } from '@/components/ui/themed-text-input';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import axios from 'axios';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

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

// --- SMALLER FUNCTIONAL COMPONENTS ---

const baseBubbleStyle = {
  paddingVertical: RFValue(8),
  paddingHorizontal: RFValue(12),
  marginVertical: RFValue(8),
  borderRadius: RFValue(8),
  maxWidth: '75%',
};

const TimeSeparator = ({ timestamp }: TimeSeparatorProps) => {
  const formattedTime = moment(timestamp).calendar(null, {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    lastWeek: 'MMM D',
    sameElse: 'MMM D'
  });

  return (
    <View style={separatorStyles.container}>
      <ThemedText type='Body3' style={separatorStyles.text}>{formattedTime}</ThemedText>
    </View>
  );
};

const UserChatBubble = ({ content }: ChatBubbleProps) => (
  <View style={[chatBubbleStyles.userContainer]}>
    <View style={[baseBubbleStyle, chatBubbleStyles.userBubble]}>
      <ThemedText type='Body3' style={chatBubbleStyles.userText}>{content}</ThemedText>
    </View>
  </View>
);

const PartnerChatBubble = ({ content, isNugget = false }: ChatBubbleProps) => (
  <View style={[chatBubbleStyles.partnerContainer]}>
    <View
      style={[
        baseBubbleStyle,
        chatBubbleStyles.nuggetBubble
      ]}
    >
      <ThemedText type='Body3' style={chatBubbleStyles.partnerText}>
        {content}
      </ThemedText>
    </View>
  </View>
);

// --- MAIN SCREEN COMPONENT ---

export default function ChatbotScreen() {
  const { uid, groups } = useAuthStore();
  const gid = groups[0];
  const { cid, otherUserId, people } = useLocalSearchParams();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [botCid, setBotCid] = useState<string | null>(null);

  const [isWaitAI, setIsWaitAI] = useState(false);

  const getChatHistory = async () => {
    const payload = {
      type: 'nugget',
      groupId: gid,
      otherUserId: otherUserId,
    };

    try {
      console.log('Fetching chat history with body:', payload);
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/create/${uid}`, payload);
      if (res.data?.existingChat?.messages) {
        setMessages(res.data.existingChat.messages); 
        setBotCid(res.data.existingChat._id);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      console.error('failed req: ', `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/create/${uid}`);
      console.error('with payload: ', payload);
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

    setMessages(prev => [...prev, userMessage, waitingMsg]);
    
    setInputText('');
    setIsLoading(true);

    const getAIResponse = async () => {
      try {
        const res = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/${botCid}/${uid}/nugget`, {
          content: trimmed
        });
        
        if (res.data && res.data.chat && res.data.chat.messages) {
          const aiMsg = res.data.chat.messages[res.data.chat.messages.length - 1]; 
          
          setMessages(prev => {
            const filteredPrev = prev.filter(msg => 
                !msg._id.startsWith('waiting-') && msg._id !== userMessage._id
            );

            const serverUserMsg = res.data.chat.messages[1];
            const serverAiMsg = res.data.chat.messages[0];

            return [
                ...filteredPrev, 
                serverUserMsg,
                serverAiMsg 
            ];
          });
          
        } else {
          console.error('No valid data in AI response');
        }
      } catch (error) {
        console.error('Error fetching AI response:', error);
        console.log('failed req: ', `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/${botCid}/${uid}/nugget`);
        
        setMessages(prev => prev.filter(msg => 
            !msg._id.startsWith('waiting-') && msg._id !== userMessage._id
        ));
      } finally {
        setIsLoading(false);
      }
    }

    getAIResponse();
  };
  
  const shouldShowTimeSeparator = (currentMsg: Message, previousMsg: Message | null): boolean => {
    if (!previousMsg) return true;

    const currentDay = moment(currentMsg.timestamp).startOf('day');
    const previousDay = moment(previousMsg.timestamp).startOf('day');

    return !currentDay.isSame(previousDay);
  };

  const renderChatHistory = (messages: Message[]) => {
    if (!messages || messages.length === 0) {
      return <ThemedText style={{ textAlign: 'center', marginTop: 20 }}>Ask Nugget a question!</ThemedText>;
    }

    const renderItem = ({ item, index }: { item: Message, index: number }) => {
      const previousMsg = index > 0 ? messages[index - 1] : null;
      const showSeparator = shouldShowTimeSeparator(item, previousMsg);

      const isMe = item.sender === uid && item.senderType === 'user';
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
        // keyExtractor={item => item._id}
        contentContainerStyle={styles.flatListContent}
      />
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Nuggit Coach' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.fullScreen}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ThemedView style={styles.container}>
          {/* Render chat list */}
          { renderChatHistory(messages) }
        </ThemedView>

        {/* Text Input Field */}
        <ThemedView style={styles.textInputContainer}>
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
    paddingVertical: RFValue(12),
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: RFValue(24),
    paddingVertical: RFValue(12),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.light.cardBorder,
    backgroundColor: Colors.light.card,
    paddingBottom: RFValue(24),
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

const separatorStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.blackSecondary,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: RFValue(4),
    paddingHorizontal: RFValue(12),
    borderRadius: RFValue(12),
    marginBottom: RFValue(12),
  },
  text: {
    fontSize: RFValue(16),
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