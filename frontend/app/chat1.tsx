import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
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
  const { name } = useLocalSearchParams();
const chatName = (name as string) ?? 'Unknown';


  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: chatName, text: 'We will have a meeting today in the lib', timestamp: '10/3/2025' },
    { id: '2', sender: 'user', text: 'r u coming?' },
    { id: '3', sender: chatName, text: 'I cannot make it T T' },
    { id: '4', sender: chatName, text: 'Could you guys just tell me what to do' },
    { id: '5', sender: 'user', text: 'Okie, check your page! We assigned your task!' },
    { id: '6', sender: 'user', text: 'How is your progress? :D', timestamp: 'Yesterday' },
  ]);

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const headerLightColor = '#1E90FF';
  const headerDarkColor = '#63B3FF';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ParallaxScrollView paddingTop={24}>
        {/* Dynamic chat heading */}
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
                ]}>
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

        <Image source={require('@/assets/images/nuggit-icon.png')} style={styles.sticker} resizeMode="contain" />
      </ParallaxScrollView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <ThemedText type="Body2" style={{ fontWeight: '600', color: '#fff' }}>
            Send
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  timestamp: { alignSelf: 'center', marginVertical: 8, fontWeight: '600' },
  messageBubble: { padding: 12, borderRadius: 12, maxWidth: '80%', marginVertical: 4 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#D9D9D9' },
  partnerBubble: { alignSelf: 'flex-start', backgroundColor: '#3B82F6' },
  sticker: { width: 48, height: 48, alignSelf: 'flex-end', marginTop: 16 },
  inputContainer: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: '#ccc', backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, height: 40, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#f0f0f0' },
  sendButton: { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#007AFF', borderRadius: 20 },
});

