import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import BazarCard from '@/components/BazarCard';
import Sidebar from '@/components/Sidebar';

const MOCK_BAZARES = [
  {
    id: '1',
    name: 'Bazar da Moda',
    description: 'Roupas vintage e acessórios exclusivos',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    rating: 4.8,
    location: 'São Paulo, SP',
  },
  {
    id: '2',
    name: 'Estilo Único',
    description: 'Peças artesanais e decoração',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
    rating: 4.5,
    location: 'Rio de Janeiro, RJ',
  },
  {
    id: '3',
    name: 'Fashion Space',
    description: 'Moda sustentável e consciente',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    rating: 4.9,
    location: 'Belo Horizonte, MG',
  },
  {
    id: '4',
    name: 'Brechó Chic',
    description: 'Roupas de marca com preços acessíveis',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    rating: 4.7,
    location: 'Curitiba, PR',
  },
];

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        <Image source={require('@/assets/logo.jpeg')} style={styles.logo} />
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.light.icon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar bazares..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Bazares em Destaque</Text>
        
        {MOCK_BAZARES.map(bazar => (
          <BazarCard
            key={bazar.id}
            {...bazar}
            isFavorite={favorites.includes(bazar.id)}
            onFavorite={() => toggleFavorite(bazar.id)}
          />
        ))}
      </ScrollView>

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
});
