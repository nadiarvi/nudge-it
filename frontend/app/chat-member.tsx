import { ThemedText, ThemedView } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import axios from 'axios';
import { Stack, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

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

// --- SMALLER FUNCTIONAL COMPONENTS ---

const baseBubbleStyle = {
  paddingVertical: 8,
  paddingHorizontal: 12,
  marginVertical: 8,
  borderRadius: 8,
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
    // <View>
      <View style={separatorStyles.container}>
        <ThemedText type='Body3' style={separatorStyles.text}>{formattedTime}</ThemedText>
      </View>
    // </View>
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
        isNugget ? chatBubbleStyles.nuggetBubble : chatBubbleStyles.partnerBubble
      ]}
    >
      <ThemedText type='Body3' style={chatBubbleStyles.partnerText}>
        {isNugget ? 'AI Assistant: ' : ''}{content}
      </ThemedText>
    </View>
  </View>
);

// --- MAIN SCREEN COMPONENT ---

export default function ChatDetailScreen() {
  const { uid } = useAuthStore();
  const { cid, name } = useLocalSearchParams();

  const [messages, setMessages] = useState<Message[]>([]); 

  const getChatHistory = async () => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/${cid}`);
      if (res.data?.existingChat?.messages) {
        setMessages(res.data.existingChat.messages); 
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    getChatHistory();
  }, [uid, cid]);

  const shouldShowTimeSeparator = (currentMsg: Message, previousMsg: Message | null): boolean => {
    if (!previousMsg) return true;

    const currentDay = moment(currentMsg.timestamp).startOf('day');
    const previousDay = moment(previousMsg.timestamp).startOf('day');

    return !currentDay.isSame(previousDay);
  };
  
  const renderChatHistory = (messages: Message[]) => {
    if (!messages || messages.length === 0) {
      return <ThemedText style={{ textAlign: 'center', marginTop: 20 }}>Start chatting now!</ThemedText>;
    }

    const renderItem = ({ item, index }: { item: Message, index: number }) => {
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
        keyExtractor={item => item._id}
      />
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: name }} />
      <ThemedView style={styles.container}>
        { renderChatHistory(messages) } 
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  }
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