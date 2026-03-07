import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';

const MOCK_MESSAGES = [
  {
    id: '1',
    name: 'Bazar da Moda',
    lastMessage: 'Obrigado pelo interesse!',
    time: '10:30',
    unread: 2,
  },
  {
    id: '2',
    name: 'Fashion Space',
    lastMessage: 'Produto disponível',
    time: 'Ontem',
    unread: 0,
  },
  {
    id: '3',
    name: 'Estilo Único',
    lastMessage: 'Quando pode retirar?',
    time: '2 dias',
    unread: 1,
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0a1929' : '#f4eddc' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.header}>
          <Text style={[styles.headerTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Mensagens</Text>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={24} color="#5f81a5" />
          </TouchableOpacity>
        </BlurView>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {MOCK_MESSAGES.map(message => (
            <TouchableOpacity 
              key={message.id} 
              style={styles.messageItem}
              onPress={() => router.push(`/chat/${message.id}`)}
            >
              <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.messageCard}>
                <View style={styles.avatarContainer}>
                  <Ionicons name="help-circle" size={40} color="#5f81a5" />
                </View>
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={[styles.name, { color: isDark ? '#f4eddc' : '#000' }]}>{message.name}</Text>
                    <Text style={[styles.time, { color: '#5f81a5' }]}>{message.time}</Text>
                  </View>
                  <View style={styles.messageFooter}>
                    <Text style={[styles.lastMessage, { color: '#5f81a5' }]} numberOfLines={1}>
                      {message.lastMessage}
                    </Text>
                    {message.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{message.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </BlurView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(95, 129, 165, 0.2)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  messageItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  messageCard: {
    flexDirection: 'row',
    padding: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(95, 129, 165, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
  },
  unreadBadge: {
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
