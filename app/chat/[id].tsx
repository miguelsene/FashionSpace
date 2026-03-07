import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';

const CHAT_DATA = {
  '1': { name: 'Bazar da Moda', messages: [
    { id: '1', text: 'Olá! Como posso ajudar?', sender: 'other', time: '10:30' },
    { id: '2', text: 'Gostaria de saber sobre aquele vestido vintage', sender: 'me', time: '10:32' },
  ]},
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(CHAT_DATA[id as string]?.messages || []);

  const chat = CHAT_DATA[id as string] || CHAT_DATA['1'];

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: Date.now().toString(),
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0a1929' : '#f4eddc' }]} edges={['top', 'bottom']}>
      <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#f4eddc' : '#000'} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Ionicons name="help-circle" size={40} color="#5f81a5" />
          <Text style={[styles.headerName, { color: isDark ? '#f4eddc' : '#000' }]}>{chat.name}</Text>
        </View>
        <View style={{ width: 24 }} />
      </BlurView>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => (
            <View style={[
              styles.messageItem,
              item.sender === 'me' ? styles.myMessage : styles.otherMessage
            ]}>
              <BlurView
                intensity={item.sender === 'me' ? 100 : 60}
                tint={item.sender === 'me' ? 'dark' : (isDark ? 'dark' : 'light')}
                style={[
                  styles.messageBubble,
                  item.sender === 'me' && { backgroundColor: 'rgba(15, 44, 71, 0.9)' }
                ]}
              >
                <Text style={[
                  styles.messageText,
                  { color: item.sender === 'me' ? '#fff' : (isDark ? '#f4eddc' : '#000') }
                ]}>
                  {item.text}
                </Text>
                <Text style={[
                  styles.messageTime,
                  { color: item.sender === 'me' ? 'rgba(255,255,255,0.7)' : '#5f81a5' }
                ]}>
                  {item.time}
                </Text>
              </BlurView>
            </View>
          )}
        />

        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { color: isDark ? '#f4eddc' : '#000' }]}
            placeholder="Digite uma mensagem..."
            placeholderTextColor="#5f81a5"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </BlurView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(95, 129, 165, 0.2)',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageItem: {
    marginBottom: 12,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(95, 129, 165, 0.2)',
    gap: 12,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 14,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#0f2c47',
    borderRadius: 24,
    padding: 12,
  },
});
