import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [settingsVisible, setSettingsVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    onClose();
    router.replace('/login');
  };

  const handleSettings = () => {
    onClose();
    router.push('/(tabs)/profile');
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.sidebarWrapper,
            {
              transform: [{
                translateX: visible ? 0 : -300
              }]
            }
          ]}
        >
          <BlurView 
            intensity={80} 
            tint={isDark ? 'dark' : 'light'} 
            style={[styles.sidebar, { backgroundColor: isDark ? 'rgba(15, 44, 71, 0.95)' : 'rgba(255, 255, 255, 0.95)' }]}
          >
          <SafeAreaView style={styles.content}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color={isDark ? '#f4eddc' : '#000'} />
            </TouchableOpacity>

            <View style={styles.menu}>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="help-circle-outline" size={24} color="#5f81a5" />
                <Text style={[styles.menuText, { color: isDark ? '#f4eddc' : '#000' }]}>Ajuda</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
                <Ionicons name="settings-outline" size={24} color="#5f81a5" />
                <Text style={[styles.menuText, { color: isDark ? '#f4eddc' : '#000' }]}>Configurações</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="information-circle-outline" size={24} color="#5f81a5" />
                <Text style={[styles.menuText, { color: isDark ? '#f4eddc' : '#000' }]}>Sobre</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
                <Text style={[styles.menuText, styles.logoutText]}>Sair</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </BlurView>
        </Animated.View>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={onClose}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebarWrapper: {
    width: '75%',
    height: '100%',
  },
  sidebar: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  overlayTouchable: {
    flex: 1,
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
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: 20,
  },
  logoutText: {
    color: '#E74C3C',
  },
});
