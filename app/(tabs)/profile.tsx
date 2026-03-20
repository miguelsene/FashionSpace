import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const MENU_ITEMS = [
  { id: 'address', label: 'Endereços', icon: 'location-outline', route: '/address', color: '#5f81a5' },
  { id: 'notifications', label: 'Notificações', icon: 'notifications-outline', route: '/notifications', color: '#5f81a5' },
  { id: 'privacy', label: 'Privacidade', icon: 'shield-checkmark-outline', route: '/privacy', color: '#5f81a5' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const router = useRouter();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const bg = isDark ? '#0a1929' : '#f4eddc';
  const cardBg = isDark ? 'rgba(15, 44, 71, 0.7)' : 'rgba(255,255,255,0.85)';
  const textColor = isDark ? '#f4eddc' : '#1a1a2e';
  const subColor = isDark ? '#a0b4c8' : '#5f81a5';

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: 'rgba(95,129,165,0.2)' }]}>
          <Text style={[styles.headerTitle, { color: textColor }]}>Perfil</Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeBtn}>
            <Ionicons name={isDark ? 'moon' : 'sunny-outline'} size={22} color={subColor} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={[styles.profileCard, { backgroundColor: cardBg }]}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? 'rgba(95,129,165,0.25)' : 'rgba(15,44,71,0.1)' }]}>
                  <Ionicons name="person" size={44} color="#5f81a5" />
                </View>
              )}
              <View style={[styles.cameraIcon, { backgroundColor: '#0f2c47' }]}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>

            <Text style={[styles.name, { color: textColor }]}>{user?.name}</Text>
            <Text style={[styles.emailText, { color: subColor }]}>{user?.email}</Text>

            <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
              <Ionicons name="create-outline" size={16} color="#fff" />
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={[styles.statsCard, { backgroundColor: cardBg }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: textColor }]}>{favorites.length}</Text>
              <Text style={[styles.statLabel, { color: subColor }]}>Favoritos</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: 'rgba(95,129,165,0.25)' }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: textColor }]}>8</Text>
              <Text style={[styles.statLabel, { color: subColor }]}>Avaliações</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: 'rgba(95,129,165,0.25)' }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: textColor }]}>12</Text>
              <Text style={[styles.statLabel, { color: subColor }]}>Visitas</Text>
            </View>
          </View>

          {/* Menu */}
          <View style={[styles.menuCard, { backgroundColor: cardBg }]}>
            {MENU_ITEMS.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, idx < MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(95,129,165,0.15)' }]}
                onPress={() => router.push(item.route as any)}
              >
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconBox, { backgroundColor: isDark ? 'rgba(95,129,165,0.2)' : 'rgba(15,44,71,0.07)' }]}>
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text style={[styles.menuText, { color: textColor }]}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={subColor} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Theme toggle */}
          <View style={[styles.menuCard, { backgroundColor: cardBg, marginTop: 0 }]}>
            <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: isDark ? 'rgba(95,129,165,0.2)' : 'rgba(15,44,71,0.07)' }]}>
                  <Ionicons name={isDark ? 'moon' : 'sunny-outline'} size={20} color="#5f81a5" />
                </View>
                <Text style={[styles.menuText, { color: textColor }]}>Modo {isDark ? 'Escuro' : 'Claro'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={subColor} />
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: 'rgba(231,76,60,0.1)', borderColor: 'rgba(231,76,60,0.3)' }]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#0f2c47' : '#fff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={subColor} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? 'rgba(95,129,165,0.15)' : '#f4eddc', color: textColor }]}
              placeholder="Nome"
              placeholderTextColor={subColor}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? 'rgba(95,129,165,0.15)' : '#f4eddc', color: textColor }]}
              placeholder="Email"
              placeholderTextColor={subColor}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? 'rgba(95,129,165,0.15)' : '#f4eddc', color: textColor }]}
              placeholder="Nova Senha"
              placeholderTextColor={subColor}
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: 'rgba(95,129,165,0.2)' }]} onPress={() => setEditModalVisible(false)}>
                <Text style={{ color: subColor, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#0f2c47' }]} onPress={() => setEditModalVisible(false)}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  themeBtn: { padding: 6 },
  content: { flex: 1, padding: 16 },
  profileCard: {
    alignItems: 'center',
    padding: 28,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: { width: 96, height: 96, borderRadius: 48 },
  cameraIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderRadius: 12,
    padding: 5,
  },
  name: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  emailText: { fontSize: 14, marginBottom: 18 },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#0f2c47',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
  },
  editButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  statsCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 12 },
  statDivider: { width: 1 },
  menuCard: {
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIconBox: { width: 38, height: 38, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  menuText: { fontSize: 16, fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 15,
    marginBottom: 24,
  },
  logoutText: { color: '#E74C3C', fontSize: 16, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: '800' },
  input: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBtn: { flex: 1, padding: 14, borderRadius: 14, alignItems: 'center' },
});
