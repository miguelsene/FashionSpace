import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import WaveBackground from '@/components/animated/WaveBackground';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();

  const textColor = isDark ? '#f4eddc' : '#1a1a2e';
  const subColor = isDark ? '#a0b4c8' : '#5f81a5';
  const inputBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.75)';

  const handleRegister = async () => {
    setLoading(true);
    await register(name, email, password);
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <WaveBackground />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.logoArea}>
            <Image source={require('@/assets/logo.jpeg')} style={styles.logo} resizeMode="cover" />
            <Text style={[styles.appName, { color: textColor }]}>FashionSpace</Text>
            <Text style={[styles.tagline, { color: subColor }]}>Crie sua conta e explore o mundo dos bazares</Text>
          </View>

          <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={styles.card}>
            <Text style={[styles.title, { color: textColor }]}>Criar Conta</Text>

            <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
              <Ionicons name="person-outline" size={20} color={subColor} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Nome completo"
                placeholderTextColor={subColor}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
              <Ionicons name="mail-outline" size={20} color={subColor} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Email"
                placeholderTextColor={subColor}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
              <Ionicons name="lock-closed-outline" size={20} color={subColor} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Senha"
                placeholderTextColor={subColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(v => !v)}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={subColor} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={loading}>
              <Text style={styles.primaryBtnText}>{loading ? 'Criando conta...' : 'Cadastrar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style={styles.linkRow}>
              <Text style={[styles.linkText, { color: subColor }]}>Já tem conta? </Text>
              <Text style={[styles.linkBold, { color: '#0f2c47' }]}>Fazer Login</Text>
            </TouchableOpacity>
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoArea: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 90, height: 90, borderRadius: 45, marginBottom: 14, borderWidth: 3, borderColor: 'rgba(95,129,165,0.4)' },
  appName: { fontSize: 32, fontWeight: '900', letterSpacing: 0.5 },
  tagline: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  card: {
    borderRadius: 28,
    padding: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(95,129,165,0.2)',
  },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 24 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(95,129,165,0.2)',
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 12 },
  primaryBtn: {
    backgroundColor: '#0f2c47',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#0f2c47',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkText: { fontSize: 14 },
  linkBold: { fontSize: 14, fontWeight: '700' },
});
