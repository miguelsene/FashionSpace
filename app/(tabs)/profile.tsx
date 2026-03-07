import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState('Português');
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0a1929' : '#f4eddc' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.header, { backgroundColor: isDark ? 'rgba(15, 44, 71, 0.9)' : 'rgba(255, 255, 255, 0.9)' }]}>
          <Text style={[styles.headerTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Perfil</Text>
          <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
            <Ionicons name="settings-outline" size={24} color={isDark ? '#f4eddc' : '#000'} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.profileSection, { backgroundColor: isDark ? 'rgba(15, 44, 71, 0.6)' : 'rgba(255, 255, 255, 0.7)' }]}>
            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="help-circle" size={80} color="#5f81a5" />
              )}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.name, { color: isDark ? '#f4eddc' : '#000' }]}>{user?.name}</Text>
            <Text style={[styles.email, { color: '#5f81a5' }]}>{user?.email}</Text>
            
            <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
              <Ionicons name="create-outline" size={16} color="#fff" />
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.statsSection, { backgroundColor: isDark ? 'rgba(15, 44, 71, 0.6)' : 'rgba(255, 255, 255, 0.7)' }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: isDark ? '#f4eddc' : '#000' }]}>{favorites.length}</Text>
              <Text style={[styles.statLabel, { color: '#5f81a5' }]}>Favoritos</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: 'rgba(95, 129, 165, 0.3)' }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: isDark ? '#f4eddc' : '#000' }]}>8</Text>
              <Text style={[styles.statLabel, { color: '#5f81a5' }]}>Avaliações</Text>
            </View>
          </View>

          <View style={[styles.menuSection, { backgroundColor: isDark ? 'rgba(15, 44, 71, 0.6)' : 'rgba(255, 255, 255, 0.7)' }]}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="location-outline" size={24} color="#5f81a5" />
                <Text style={[styles.menuItemText, { color: isDark ? '#f4eddc' : '#000' }]}>Endereços</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#5f81a5" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="notifications-outline" size={24} color="#5f81a5" />
                <Text style={[styles.menuItemText, { color: isDark ? '#f4eddc' : '#000' }]}>Notificações</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#5f81a5" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
              <View style={styles.menuItemLeft}>
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color="#5f81a5" />
                <Text style={[styles.menuItemText, { color: isDark ? '#f4eddc' : '#000' }]}>Modo {isDark ? 'Escuro' : 'Claro'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#5f81a5" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#5f81a5" />
                <Text style={[styles.menuItemText, { color: isDark ? '#f4eddc' : '#000' }]}>Privacidade</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#5f81a5" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={logout}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
                <Text style={[styles.menuItemText, { color: '#E74C3C' }]}>Sair</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal de Edição */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#0f2c47' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Editar Perfil</Text>
            
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? 'rgba(95, 129, 165, 0.2)' : '#f4eddc', color: isDark ? '#f4eddc' : '#000' }]}
              placeholder="Nome"
              placeholderTextColor="#5f81a5"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? 'rgba(95, 129, 165, 0.2)' : '#f4eddc', color: isDark ? '#f4eddc' : '#000' }]}
              placeholder="Email"
              placeholderTextColor="#5f81a5"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? 'rgba(95, 129, 165, 0.2)' : '#f4eddc', color: isDark ? '#f4eddc' : '#000' }]}
              placeholder="Endereço"
              placeholderTextColor="#5f81a5"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? 'rgba(95, 129, 165, 0.2)' : '#f4eddc', color: isDark ? '#f4eddc' : '#000' }]}
              placeholder="Nova Senha"
              placeholderTextColor="#5f81a5"
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Configurações */}
      <Modal visible={settingsModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#0f2c47' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Configurações</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: isDark ? '#f4eddc' : '#000' }]}>Idioma</Text>
              <Text style={[styles.settingValue, { color: '#5f81a5' }]}>{language}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
              <Text style={[styles.settingLabel, { color: isDark ? '#f4eddc' : '#000' }]}>Tema</Text>
              <Text style={[styles.settingValue, { color: '#5f81a5' }]}>{isDark ? 'Escuro' : 'Claro'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: isDark ? '#f4eddc' : '#000' }]}>Notificações</Text>
              <Text style={[styles.settingValue, { color: '#5f81a5' }]}>Ativadas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, styles.saveButton, { marginTop: 20 }]} onPress={() => setSettingsModalVisible(false)}>
              <Text style={styles.saveButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  profileSection: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(95, 129, 165, 0.3)',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(95, 129, 165, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0f2c47',
    borderRadius: 15,
    padding: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#0f2c47',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(95, 129, 165, 0.3)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
  },
  menuSection: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(95, 129, 165, 0.3)',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(95, 129, 165, 0.2)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(95, 129, 165, 0.2)',
  },
  cancelButtonText: {
    color: '#5f81a5',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#0f2c47',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(95, 129, 165, 0.2)',
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
