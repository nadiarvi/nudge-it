import React, { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import {
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  FlatList,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';

type Message = {
  id: string;
  sender: 'user' | string;
  text: string;
  timestamp?: string;
};

export default function ChatDetailScreen() {
  const { name, preset } = useLocalSearchParams(); // ✅ FIXED
  const chatName = (name as string) ?? 'Unknown';
  const presetKey = preset as string;
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: chatName, text: 'We will have a meeting today in the lib', timestamp: '10/3/2025' },
    { id: '2', sender: 'user', text: 'r u coming?' },
    { id: '3', sender: chatName, text: 'I cannot make it T T' },
    { id: '4', sender: chatName, text: 'Could you guys just tell me what to do' },
    { id: '5', sender: 'user', text: 'Okie, check your page! We assigned your task!' },
    { id: '6', sender: 'user', text: 'How is your progress? :D', timestamp: 'Yesterday' },
  ]);

  const [inputText, setInputText] = useState('');
  const [suggestionVisible, setSuggestionVisible] = useState(false);
  const [followUpVisible, setFollowUpVisible] = useState(false);

  useEffect(() => {
    if (presetKey === 'adel-task-reminder') {
      const presetMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: 'Hello, I noticed that you haven’t done your part. As the date is coming soon, could you please check it out?',
        timestamp: new Date().toLocaleDateString(),
      };
      const adelReplies: Message[] = [
        { id: 'reply1', sender: chatName, text: 'I don’t think I can do it in time' },
        { id: 'reply2', sender: chatName, text: 'Could you do my part?' },
      ];
      setMessages(prev => [...prev, presetMessage, ...adelReplies]);
    }
  }, []);

  const handleSend = () => {
  if (!inputText.trim()) return;

  const newMessage: Message = {
    id: Date.now().toString(),
    sender: 'user',
    text: inputText.trim(),
    timestamp: new Date().toLocaleTimeString(),
  };

  setMessages(prev => [...prev, newMessage]);

  // ✅ Check if it's the final suggestion message
  if (
    inputText.trim() ===
    "I won’t do it for you but I can help you with it! Let’s do it together now or by today at the very least!"
  ) {
    // Add hardcoded reply after a short delay
    setTimeout(() => {
      const reply: Message = {
        id: Date.now().toString() + '-reply',
        sender: chatName,
        text: 'Ok, TTI! Does 9pm work?',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1000); // 1 second delay
  }

  setInputText('');
  setSuggestionVisible(false);
  setFollowUpVisible(false);
};

  const handleNuggitPress = () => {
    router.push('/chatbot');
  };

  const headerLightColor = '#1E90FF';
  const headerDarkColor = '#63B3FF';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <BlurView
  intensity={suggestionVisible || followUpVisible ? 80 : 50}
  tint="light"
  style={{ flex: 1 }}
>
        <ParallaxScrollView paddingTop={24}>
          <ThemedText type="H2" lightColor={headerLightColor} darkColor={headerDarkColor}>
            {chatName}
          </ThemedText>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <>
                {item.timestamp && (
                  <ThemedText type="Body2" style={styles.timestamp}>
                    {item.timestamp}
                  </ThemedText>
                )}
                <ThemedView
                  style={[
                    styles.messageBubble,
                    item.sender === 'user' ? styles.userBubble : styles.partnerBubble,
                  ]}
                >
                  <ThemedText
                    type="Body3"
                    style={item.sender === chatName ? { color: '#fff' } : undefined}
                  >
                    {item.text}
                  </ThemedText>
                </ThemedView>
              </>
            )}
          />

          <View style={styles.stickerContainer}>
            <ThemedText type="Body3" style={styles.clickMeText}>
              Don’t know what to say? Click me
            </ThemedText>
            <TouchableOpacity onPress={handleNuggitPress}>
              <Image
                source={require('@/assets/images/nuggit-icon.png')}
                style={styles.sticker}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* ✅ First suggestion — stays until OK is pressed */}
{suggestionVisible && (
  <ThemedView style={styles.suggestionBox}>
    <ThemedText type="Body2" style={styles.suggestionText}>
      We should foster a friendlier tone before escalating the problem. Let’s try confronting in another way!
    </ThemedText>
  </ThemedView>
)}

{/* ✅ Second suggestion — appears below with buttons */}
{followUpVisible && (
  <ThemedView style={styles.suggestionBox}>
    <ThemedText type="Body2" style={styles.suggestionText}>
      I won’t do it for you but I can help you with it! Let’s do it together now or by today at the very least!
    </ThemedText>
    <View style={styles.suggestionActions}>
      <TouchableOpacity
        onPress={() => {
          const suggestionText =
            "I won’t do it for you but I can help you with it! Let’s do it together now or by today at the very least!";
          setInputText(suggestionText);
          setSuggestionVisible(false); // ✅ Hide first suggestion
          setFollowUpVisible(false);   // ✅ Hide second suggestion box
        }}
      >
        <ThemedText type="Body2" style={styles.useButton}>OK!</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setFollowUpVisible(false); // ✅ Only hide second suggestion
        }}
      >
        <ThemedText type="Body2" style={styles.ignoreButton}>Ignore</ThemedText>
      </TouchableOpacity>
    </View>
  </ThemedView>
)}

        </ParallaxScrollView>

        {/* Input Field */}
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={(text) => {
              const cleaned = text
                .toLowerCase()
                .replace(/’/g, "'")
                .replace(/\s+/g, ' ');

              setInputText(text);
              const trigger = cleaned.includes("shouldn't you have started already, that's so irresponsible what the hell");
              setSuggestionVisible(trigger);
              setFollowUpVisible(false);

              if (trigger) {
                setTimeout(() => {
                  setFollowUpVisible(true);
                }, 10000);
              }
            }}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <ThemedText type="Body2" style={{ fontWeight: '600', color: '#fff' }}>
              Send
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </BlurView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  timestamp: {
    alignSelf: 'center',
    marginVertical: 8,
    fontWeight: '600',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#D9D9D9',
  },
  partnerBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#3B82F6',
  },
  stickerContainer: {
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingBottom: 12,
    marginTop: 8,
  },
  sticker: {
    width: 48,
    height: 48,
    marginTop: 4,
  },
  clickMeText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },

  suggestionBox: {
  backgroundColor: '#fff',
  padding: 12,
  marginHorizontal: 12,
  marginTop: 12,
  borderRadius: 12,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  alignSelf: 'flex-end',
  maxWidth: '80%',
},

suggestionText: {
  fontSize: 14,
  marginBottom: 8,
  color: '#555',
},
suggestionActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
useButton: {
  color: '#007AFF',
  fontWeight: '600',
},
ignoreButton: {
  color: '#888',
},
});