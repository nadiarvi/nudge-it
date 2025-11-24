import { ThemedText, ThemedView } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import axios from 'axios';
import { Stack, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface Message {
  _id: string;
  content: string;
  sender: string | null;
  senderType: 'user' | 'nugget';
  timestamp: string;
}

export default function ChatDetailScreen() {
  const { uid } = useAuthStore();
  const { cid } = useLocalSearchParams();

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

    // Use a custom render function for FlatList items
    const renderItem = ({ item, index }: { item: Message, index: number }) => {
      const previousMsg = index > 0 ? messages[index - 1] : null;
      const showSeparator = shouldShowTimeSeparator(item, previousMsg);
      
      const isMe = item.sender === uid;
      const isNugget = item.senderType === 'nugget';

      let chatBubble;

      if (isMe) {
        // Current user's message (Right side)
        chatBubble = <UserChatBubble content={item.content} />;
      } else {
        // Partner or Nugget message (Left side)
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
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Chat Member' }} />
      <ThemedView style={styles.container}>
        { renderChatHistory(messages) } 
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
  }
});

const TimeSeparator = ({ timestamp }) => {
  const formattedTime = moment(timestamp).format('LLL');
  return (
    <View style={separatorStyles.container}>
      <Text style={separatorStyles.text}>{formattedTime}</Text>
    </View>
  );
};

const baseBubbleStyle = {
  paddingVertical: 8,
  paddingHorizontal: 12,
  marginVertical: 8,
  borderRadius: 8,
  maxWidth: '75%',
};

const UserChatBubble = ({ content }) => (
  <View style={[chatBubbleStyles.userContainer]}>
    <View style={[baseBubbleStyle, chatBubbleStyles.userBubble]}>
      <ThemedText type='Body3' style={chatBubbleStyles.userText}>{content}</ThemedText>
    </View>
  </View>
);

const PartnerChatBubble = ({ content, isNugget = false }) => (
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

const separatorStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  text: {
    fontSize: 12,
    color: '#999',
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