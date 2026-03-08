import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import BazarCard from '@/components/BazarCard';
import WaveBackground from '@/components/animated/WaveBackground';
import { BlurView } from 'expo-blur';
import { ALL_BAZARES } from '@/constants/bazares';

export default function FavoritesScreen() {
  const { isDark } = useTheme();
  const { favorites } = useFavorites();

  const favoriteBazares = ALL_BAZARES.filter(bazar => favorites.includes(bazar.id));

  return (
    <View style={styles.container}>
      <WaveBackground />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.header}>
          <Text style={[styles.headerTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Favoritos</Text>
          <Text style={[styles.headerSubtitle, { color: '#5f81a5' }]}>{favorites.length} bazares</Text>
        </BlurView>

        {favoriteBazares.length > 0 ? (
          <FlatList
            data={favoriteBazares}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <BazarCard {...item} />
              </View>
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={80} color="rgba(95, 129, 165, 0.5)" />
            <Text style={[styles.emptyText, { color: isDark ? '#f4eddc' : '#000' }]}>Nenhum favorito ainda</Text>
            <Text style={[styles.emptySubtext, { color: '#5f81a5' }]}>Adicione bazares aos seus favoritos</Text>
          </View>
        )}
      </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(95, 129, 165, 0.2)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '48%',
    marginHorizontal: 4,
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
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});
