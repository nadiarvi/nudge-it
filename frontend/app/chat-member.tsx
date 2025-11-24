import { ThemedText, ThemedTouchableView, ThemedView } from '@/components/ui';
import { ThemedTextInput } from '@/components/ui/themed-text-input';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import axios from 'axios';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

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
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]); 
  const [currentMsg, setCurrentMsg] = useState<string>('');

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

  const sendMessage = async () => {
    if (!currentMsg.trim()) return;

    const newMessage: Message = {
      _id: Date.now().toString(),
      content: currentMsg.trim(),
      sender: uid,
      receiver: 'partner-id', // Placeholder, you need the partner's UID
      senderType: 'user',
      timestamp: moment().toISOString(),
    };
    
    // Add the new message to the top of the list (since FlatList is inverted)
    setMessages(prev => [...prev, newMessage]); 

    // 2. Clear input field
    setCurrentMsg('');

    // 3. API Call to Send Message (Placeholder for actual API call)
    try {
      console.log("Sending message:", newMessage.content);
      // await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chats/${cid}/message`, {
      //   content: newMessage.content,
      //   // Add other required fields like receiver ID
      // });
    } catch (error) {
      console.error('Error sending message:', error);
      // Rollback UI change if API fails
      setMessages(prev => prev.filter(msg => msg._id !== newMessage._id)); 
    }
  };

  const handleNuggitPress = () => {
    router.push({
      pathname: '/chatbot', 
      params: { 
        cid
      }
    });
  }


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
        contentContainerStyle={styles.flatListContent} 
      />
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ title: name }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.fullScreen}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ThemedView style={styles.container}>
          { renderChatHistory(messages) } 
        </ThemedView>

        <TouchableOpacity onPress={handleNuggitPress}>
          <Image
            source={require('@/assets/images/nuggit-icon.png')}
            style={styles.sticker}
            resizeMode="contain"
          />
        </TouchableOpacity>


        <ThemedView style={styles.textInputContainer}>
          <ThemedTextInput
            style={styles.textInput}
            placeholder="Type your message here..."
            value={currentMsg}
            onChangeText={setCurrentMsg}
            multiline
          />
          <ThemedTouchableView 
            onPress={sendMessage}
            style={styles.sendButton}
            disabled={!currentMsg.trim()}
          >
            <ThemedText style={styles.sendButtonText}>Send</ThemedText>
          </ThemedTouchableView>
        </ThemedView>
      </KeyboardAvoidingView>
    </>
  )
}

// --- STYLES ---

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