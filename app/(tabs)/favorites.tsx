import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import BazarCard from '@/components/BazarCard';

const MOCK_FAVORITES = [
  {
    id: '1',
    name: 'Bazar da Moda',
    description: 'Roupas vintage e acessórios exclusivos',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    rating: 4.8,
    location: 'São Paulo, SP',
  },
  {
    id: '3',
    name: 'Fashion Space',
    description: 'Moda sustentável e consciente',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    rating: 4.9,
    location: 'Belo Horizonte, MG',
  },
];

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {MOCK_FAVORITES.length > 0 ? (
          MOCK_FAVORITES.map(bazar => (
            <BazarCard key={bazar.id} {...bazar} isFavorite={true} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={80} color={Colors.light.border} />
            <Text style={styles.emptyText}>Nenhum favorito ainda</Text>
            <Text style={styles.emptySubtext}>Adicione bazares aos seus favoritos</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.icon,
    marginTop: 8,
  },
});
