import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

const NOTIFICATION_GROUPS = [
  {
    group: 'Bazares',
    items: [
      { id: 'new_bazar', label: 'Novos bazares próximos', icon: 'storefront-outline', defaultOn: true },
      { id: 'bazar_promo', label: 'Promoções e ofertas', icon: 'pricetag-outline', defaultOn: true },
      { id: 'bazar_event', label: 'Eventos especiais', icon: 'calendar-outline', defaultOn: false },
    ],
  },
  {
    group: 'Mensagens',
    items: [
      { id: 'msg', label: 'Novas mensagens', icon: 'chatbubble-outline', defaultOn: true },
      { id: 'reply', label: 'Respostas', icon: 'return-down-back-outline', defaultOn: true },
    ],
  },
  {
    group: 'Conta',
    items: [
      { id: 'security', label: 'Alertas de segurança', icon: 'shield-outline', defaultOn: true },
      { id: 'updates', label: 'Atualizações do app', icon: 'refresh-outline', defaultOn: false },
    ],
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const initialState: Record<string, boolean> = {};
  NOTIFICATION_GROUPS.forEach(g => g.items.forEach(i => { initialState[i.id] = i.defaultOn; }));
  const [prefs, setPrefs] = useState(initialState);

  const bg = isDark ? '#0a1929' : '#f4eddc';
  const cardBg = isDark ? 'rgba(15, 44, 71, 0.7)' : 'rgba(255,255,255,0.85)';
  const textColor = isDark ? '#f4eddc' : '#1a1a2e';
  const subColor = isDark ? '#a0b4c8' : '#5f81a5';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: 'rgba(95,129,165,0.2)' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Notificações</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.heroBadge, { backgroundColor: isDark ? 'rgba(95,129,165,0.2)' : 'rgba(15,44,71,0.08)' }]}>
            <Ionicons name="notifications" size={40} color="#5f81a5" />
            <Text style={[styles.heroTitle, { color: textColor }]}>Preferências de Notificação</Text>
            <Text style={[styles.heroSub, { color: subColor }]}>Escolha o que deseja receber</Text>
          </View>

          {NOTIFICATION_GROUPS.map((group) => (
            <View key={group.group} style={styles.groupBlock}>
              <Text style={[styles.groupLabel, { color: subColor }]}>{group.group.toUpperCase()}</Text>
              <View style={[styles.card, { backgroundColor: cardBg }]}>
                {group.items.map((item, idx) => (
                  <View
                    key={item.id}
                    style={[
                      styles.row,
                      idx < group.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(95,129,165,0.15)' },
                    ]}
                  >
                    <View style={styles.rowLeft}>
                      <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(95,129,165,0.2)' : 'rgba(15,44,71,0.08)' }]}>
                        <Ionicons name={item.icon as any} size={20} color="#5f81a5" />
                      </View>
                      <Text style={[styles.rowLabel, { color: textColor }]}>{item.label}</Text>
                    </View>
                    <Switch
                      value={prefs[item.id]}
                      onValueChange={v => setPrefs(p => ({ ...p, [item.id]: v }))}
                      trackColor={{ false: 'rgba(95,129,165,0.3)', true: '#5f81a5' }}
                      thumbColor={prefs[item.id] ? '#0f2c47' : '#f4eddc'}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 32 },
  heroBadge: {
    alignItems: 'center',
    borderRadius: 20,
    padding: 28,
    marginBottom: 20,
    gap: 8,
  },
  heroTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  heroSub: { fontSize: 13 },
  groupBlock: { marginBottom: 20 },
  groupLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  rowLabel: { fontSize: 15, flex: 1 },
});
