import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALL_BAZARES } from '@/constants/bazares';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

const AUTO_REPLIES = [
  'Olá! Como posso ajudar? 😊',
  'Claro! Temos essa peça disponível.',
  'Pode passar na loja para ver pessoalmente!',
  'Obrigado pelo interesse! 🙏',
  'Sim, fazemos reservas por 24h.',
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const listRef = useRef<FlatList>(null);
  const sid = id as string;

  const bazar = ALL_BAZARES.find(b => b.id === sid) || ALL_BAZARES[0];
  const storageKey = `chat_${sid}`;

  const textColor = isDark ? '#f4eddc' : '#1a1a2e';
  const subColor = isDark ? '#a0b4c8' : '#5f81a5';

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(storageKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        const initial: Message[] = [
          { id: '0', text: `Olá! Bem-vindo ao ${bazar.name}. Como posso ajudar?`, sender: 'other', time: formatTime() },
        ];
        setMessages(initial);
        await AsyncStorage.setItem(storageKey, JSON.stringify(initial));
      }
    })();
  }, [sid]);

  const formatTime = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const saveMessages = async (msgs: Message[]) => {
    await AsyncStorage.setItem(storageKey, JSON.stringify(msgs));
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const myMsg: Message = { id: Date.now().toString(), text: message.trim(), sender: 'me', time: formatTime() };
    const updated = [...messages, myMsg];
    setMessages(updated);
    setMessage('');
    await saveMessages(updated);
    setTimeout(async () => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        sender: 'other',
        time: formatTime(),
      };
      const withReply = [...updated, reply];
      setMessages(withReply);
      await saveMessages(withReply);
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0a1929' : '#f4eddc' }]}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={[styles.avatar, { backgroundColor: isDark ? 'rgba(95,129,165,0.25)' : 'rgba(15,44,71,0.1)' }]}>
              <Ionicons name="storefront" size={22} color={subColor} />
            </View>
            <View>
              <Text style={[styles.headerName, { color: textColor }]}>{bazar.name}</Text>
              <Text style={[styles.headerSub, { color: subColor }]}>Online agora</Text>
            </View>
          </View>
          <View style={{ width: 40 }} />
        </BlurView>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View style={[styles.msgRow, item.sender === 'me' ? styles.myRow : styles.otherRow]}>
                {item.sender === 'other' && (
                  <View style={[styles.msgAvatar, { backgroundColor: isDark ? 'rgba(95,129,165,0.2)' : 'rgba(15,44,71,0.08)' }]}>
                    <Ionicons name="storefront" size={14} color={subColor} />
                  </View>
                )}
                <View style={[styles.bubble, item.sender === 'me' ? styles.myBubble : [styles.otherBubble, { backgroundColor: isDark ? 'rgba(15,44,71,0.8)' : 'rgba(255,255,255,0.9)' }]]}>
                  <Text style={[styles.msgText, { color: item.sender === 'me' ? '#fff' : textColor }]}>{item.text}</Text>
                  <Text style={[styles.msgTime, { color: item.sender === 'me' ? 'rgba(255,255,255,0.6)' : subColor }]}>{item.time}</Text>
                </View>
              </View>
            )}
          />

          <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.inputBar}>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,44,71,0.06)' }]}
              placeholder="Digite uma mensagem..."
              placeholderTextColor={subColor}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={[styles.sendBtn, { opacity: message.trim() ? 1 : 0.5 }]} onPress={sendMessage}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </BlurView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(95,129,165,0.2)',
  },
  backBtn: { padding: 4 },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerName: { fontSize: 15, fontWeight: '700' },
  headerSub: { fontSize: 12 },
  list: { padding: 16, gap: 10, paddingBottom: 8 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  myRow: { justifyContent: 'flex-end' },
  otherRow: { justifyContent: 'flex-start' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 18 },
  myBubble: { backgroundColor: '#0f2c47', borderBottomRightRadius: 4 },
  otherBubble: { borderBottomLeftRadius: 4 },
  msgText: { fontSize: 14, lineHeight: 20 },
  msgTime: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: 'rgba(95,129,165,0.2)',
    overflow: 'hidden',
  },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100 },
  sendBtn: { backgroundColor: '#0f2c47', borderRadius: 22, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
});
