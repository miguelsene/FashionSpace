import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    onClose();
    router.replace('/login');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.sidebar}>
          <SafeAreaView style={styles.content}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color={Colors.light.text} />
            </TouchableOpacity>

            <View style={styles.menu}>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="help-circle-outline" size={24} color={Colors.light.primary} />
                <Text style={styles.menuText}>Ajuda</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="settings-outline" size={24} color={Colors.light.primary} />
                <Text style={styles.menuText}>Configurações</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="information-circle-outline" size={24} color={Colors.light.primary} />
                <Text style={styles.menuText}>Sobre</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
                <Text style={[styles.menuText, styles.logoutText]}>Sair</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  sidebar: {
    width: '75%',
    height: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  menu: {
    marginTop: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: 20,
  },
  logoutText: {
    color: '#E74C3C',
  },
});
