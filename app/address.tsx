import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  isPrimary: boolean;
}

export default function AddressScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', label: 'Casa', street: 'Rua das Flores, 123', city: 'São Paulo, SP', isPrimary: true },
  ]);
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');

  const bg = isDark ? '#0a1929' : '#f4eddc';
  const cardBg = isDark ? 'rgba(15, 44, 71, 0.7)' : 'rgba(255,255,255,0.85)';
  const textColor = isDark ? '#f4eddc' : '#1a1a2e';
  const subColor = isDark ? '#a0b4c8' : '#5f81a5';
  const inputBg = isDark ? 'rgba(95,129,165,0.15)' : 'rgba(15,44,71,0.06)';

  const handleAdd = () => {
    if (!label.trim() || !street.trim() || !city.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    setAddresses(prev => [...prev, { id: Date.now().toString(), label, street, city, isPrimary: false }]);
    setLabel(''); setStreet(''); setCity('');
    setAdding(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Remover endereço', 'Deseja remover este endereço?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => setAddresses(p => p.filter(a => a.id !== id)) },
    ]);
  };

  const handleSetPrimary = (id: string) => {
    setAddresses(p => p.map(a => ({ ...a, isPrimary: a.id === id })));
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: 'rgba(95,129,165,0.2)' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Endereços</Text>
          <TouchableOpacity onPress={() => setAdding(true)} style={styles.addBtn}>
            <Ionicons name="add" size={26} color="#5f81a5" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {addresses.length === 0 && (
            <View style={[styles.emptyBox, { backgroundColor: cardBg }]}>
              <Ionicons name="location-outline" size={48} color="#5f81a5" />
              <Text style={[styles.emptyText, { color: subColor }]}>Nenhum endereço cadastrado</Text>
            </View>
          )}

          {addresses.map(addr => (
            <View key={addr.id} style={[styles.card, { backgroundColor: cardBg }]}>
              <View style={styles.cardTop}>
                <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(95,129,165,0.2)' : 'rgba(15,44,71,0.08)' }]}>
                  <Ionicons name="location" size={22} color="#5f81a5" />
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.labelRow}>
                    <Text style={[styles.addrLabel, { color: textColor }]}>{addr.label}</Text>
                    {addr.isPrimary && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryText}>Principal</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.addrStreet, { color: textColor }]}>{addr.street}</Text>
                  <Text style={[styles.addrCity, { color: subColor }]}>{addr.city}</Text>
                </View>
              </View>
              <View style={[styles.cardActions, { borderTopColor: 'rgba(95,129,165,0.15)' }]}>
                {!addr.isPrimary && (
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleSetPrimary(addr.id)}>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#5f81a5" />
                    <Text style={[styles.actionText, { color: '#5f81a5' }]}>Definir principal</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(addr.id)}>
                  <Ionicons name="trash-outline" size={18} color="#E74C3C" />
                  <Text style={[styles.actionText, { color: '#E74C3C' }]}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {adding && (
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <Text style={[styles.formTitle, { color: textColor }]}>Novo Endereço</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                placeholder="Rótulo (ex: Casa, Trabalho)"
                placeholderTextColor={subColor}
                value={label}
                onChangeText={setLabel}
              />
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                placeholder="Rua, número"
                placeholderTextColor={subColor}
                value={street}
                onChangeText={setStreet}
              />
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                placeholder="Cidade, Estado"
                placeholderTextColor={subColor}
                value={city}
                onChangeText={setCity}
              />
              <View style={styles.formBtns}>
                <TouchableOpacity style={[styles.formBtn, { backgroundColor: 'rgba(95,129,165,0.2)' }]} onPress={() => setAdding(false)}>
                  <Text style={{ color: subColor, fontWeight: '600' }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.formBtn, { backgroundColor: '#0f2c47' }]} onPress={handleAdd}>
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!adding && (
            <TouchableOpacity style={[styles.addNewBtn, { borderColor: 'rgba(95,129,165,0.4)' }]} onPress={() => setAdding(true)}>
              <Ionicons name="add-circle-outline" size={22} color="#5f81a5" />
              <Text style={{ color: '#5f81a5', fontWeight: '600', fontSize: 15 }}>Adicionar endereço</Text>
            </TouchableOpacity>
          )}
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
  addBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 32 },
  emptyBox: { borderRadius: 16, padding: 40, alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 15 },
  card: {
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: { flexDirection: 'row', padding: 16, gap: 14 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  addrLabel: { fontSize: 16, fontWeight: '700' },
  primaryBadge: { backgroundColor: '#5f81a5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  primaryText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  addrStreet: { fontSize: 14, marginBottom: 2 },
  addrCity: { fontSize: 13 },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 16,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 13, fontWeight: '600' },
  formTitle: { fontSize: 17, fontWeight: '700', padding: 16, paddingBottom: 8 },
  input: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  formBtns: { flexDirection: 'row', gap: 10, padding: 16, paddingTop: 6 },
  formBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 4,
  },
});
