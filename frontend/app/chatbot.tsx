import React, { useState, useEffect } from 'react';
import {
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  FlatList,
  View,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';

type Message = {
  id: string;
  sender: 'user' | 'nuggit';
  text: string;
  timestamp?: string;
  type?: 'suggestion' | 'normal';
};

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        sender: 'user',
        text: 'How should I tell my group mate that I have assigned a task for her',
        timestamp: '10/20/2023',
      },
      {
        id: '2',
        sender: 'nuggit',
        text: 'Something like:',
        type: 'suggestion',
      },
      {
        id: '3',
        sender: 'nuggit',
        text: 'Check your page, we have assigned you a task for this project',
        type: 'suggestion',
      },
    ];
    setMessages(initialMessages);
  }, []);

  const handleSend = () => {
  const trimmed = inputText.trim();
  if (!trimmed) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    sender: 'user',
    text: trimmed,
    timestamp: new Date().toLocaleDateString(),
  };

  const lower = trimmed.toLowerCase();

  if (lower.includes('how should i ask someone to do their work')) {
    const nuggitReply: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'nuggit',
      text: 'Hello, I noticed that your teammate hasn’t started yet. You could say something like:',
      type: 'suggestion',
    };

    setMessages(prev => [...prev, userMessage, nuggitReply]);

    // Delay modal popup slightly to feel natural
    setTimeout(() => {
      setShowModal(true);
    }, 500);
  } else {
    setMessages(prev => [...prev, userMessage]);
  }

  setInputText('');
};

  const handleConfirmSend = () => {
    setShowModal(false);
    router.push({
      pathname: '/chat1',
      params: {
        name: 'Adel',
        preset: 'adel-task-reminder',
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ThemedView style={{ flex: 1 }}>
        <ParallaxScrollView paddingTop={24}>
          <ThemedText type="H2" style={styles.header}>Nuggit</ThemedText>

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
                    item.sender === 'user'
                      ? styles.userBubble
                      : styles.suggestionBubble,
                  ]}
                >
                  <ThemedText
                    type="Body3"
                    style={{ color: item.sender === 'user' ? '#000' : '#fff' }}
                  >
                    {item.text}
                  </ThemedText>
                </ThemedView>
              </>
            )}
          />
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

        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <ThemedText type="Body2" style={{ marginBottom: 12 }}>
                Send to Adel?
              </ThemedText>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={handleConfirmSend} style={styles.modalButton}>
                  <ThemedText type="Body2" style={{ color: '#fff' }}>OK!</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowModal(false)} style={[styles.modalButton, { backgroundColor: '#ccc' }]}>
                  <ThemedText type="Body2">Ignore</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 12, paddingHorizontal: 12 },
  timestamp: { alignSelf: 'center', marginVertical: 8, fontWeight: '600' },
  messageBubble: {
    padding: 12, borderRadius: 12, maxWidth: '80%', marginVertical: 4,
  },
  userBubble: {
    alignSelf: 'flex-end', backgroundColor: '#D9D9D9',
  },
  suggestionBubble: {
    alignSelf: 'flex-start', backgroundColor: '#F87171',
  },
  inputContainer: {
    flexDirection: 'row', padding: 12, borderTopWidth: 1,
    borderColor: '#ccc', backgroundColor: '#fff', alignItems: 'center',
  },
  input: {
    flex: 1, height: 40, paddingHorizontal: 12,
    borderRadius: 20, backgroundColor: '#f0f0f0',
  },
  sendButton: {
    marginLeft: 8, paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: '#007AFF', borderRadius: 20,
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff', padding: 20,
    borderRadius: 12, width: '80%',
  },
  modalButton: {
    backgroundColor: '#007AFF', padding: 10,
    borderRadius: 8, marginHorizontal: 4,
  },
});
