import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

const SECTIONS = [
  {
    title: '1. Coleta de Dados',
    content: 'Coletamos informações que você nos fornece diretamente, como nome, e-mail e endereço ao criar sua conta. Também coletamos dados de uso do aplicativo para melhorar sua experiência.',
  },
  {
    title: '2. Uso das Informações',
    content: 'Suas informações são usadas para personalizar sua experiência, enviar notificações relevantes sobre bazares próximos e melhorar nossos serviços. Nunca vendemos seus dados a terceiros.',
  },
  {
    title: '3. Compartilhamento',
    content: 'Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para operar o serviço (ex: processamento de pagamentos) ou quando exigido por lei.',
  },
  {
    title: '4. Segurança',
    content: 'Utilizamos criptografia e medidas de segurança padrão da indústria para proteger seus dados. Seus dados são armazenados em servidores seguros.',
  },
  {
    title: '5. Seus Direitos',
    content: 'Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento. Entre em contato conosco pelo suporte para exercer esses direitos.',
  },
  {
    title: '6. Cookies',
    content: 'Usamos cookies e tecnologias similares para melhorar a navegação e personalizar conteúdo. Você pode desativar cookies nas configurações do dispositivo.',
  },
  {
    title: '7. Contato',
    content: 'Para dúvidas sobre esta política, entre em contato: privacidade@fashionspace.com.br',
  },
];

export default function PrivacyScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

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
          <Text style={[styles.headerTitle, { color: textColor }]}>Privacidade</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.heroBadge, { backgroundColor: isDark ? 'rgba(95,129,165,0.2)' : 'rgba(15,44,71,0.08)' }]}>
            <Ionicons name="shield-checkmark" size={40} color="#5f81a5" />
            <Text style={[styles.heroTitle, { color: textColor }]}>Política de Privacidade</Text>
            <Text style={[styles.heroSub, { color: subColor }]}>Atualizado em Janeiro de 2025</Text>
          </View>

          {SECTIONS.map((s, i) => (
            <View key={i} style={[styles.card, { backgroundColor: cardBg }]}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>{s.title}</Text>
              <Text style={[styles.sectionText, { color: subColor }]}>{s.content}</Text>
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
    marginBottom: 16,
    gap: 8,
  },
  heroTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  heroSub: { fontSize: 13 },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  sectionText: { fontSize: 14, lineHeight: 22 },
});
