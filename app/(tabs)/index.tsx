import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import BazarCardHorizontal from '@/components/BazarCardHorizontal';
import WaveBackground from '@/components/animated/WaveBackground';
import Sidebar from '@/components/Sidebar';
import { BlurView } from 'expo-blur';

const MOCK_BAZARES = [
  { id: '1', name: 'Bazar da Moda', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', rating: 4.8, location: 'São Paulo, SP', category: 'moda' },
  { id: '2', name: 'Estilo Único', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800', rating: 4.5, location: 'Rio de Janeiro, RJ', category: 'artesanato' },
  { id: '3', name: 'Fashion Space', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800', rating: 4.9, location: 'Belo Horizonte, MG', category: 'moda' },
  { id: '4', name: 'Brechó Chic', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', rating: 4.7, location: 'Curitiba, PR', category: 'vintage' },
  { id: '5', name: 'Arte & Estilo', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800', rating: 4.6, location: 'Porto Alegre, RS', category: 'artesanato' },
  { id: '6', name: 'Decoração Chic', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800', rating: 4.4, location: 'Salvador, BA', category: 'decoracao' },
];

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'moda', label: 'Moda' },
  { id: 'artesanato', label: 'Artesanato' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'decoracao', label: 'Decoração' },
];

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const router = useRouter();

  const getBazaresByCategory = (category: string) => {
    return MOCK_BAZARES.filter(bazar => 
      bazar.category === category && 
      bazar.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <View style={styles.container}>
      <WaveBackground />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.header}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)}>
            <Ionicons name="menu" size={28} color={isDark ? '#f4eddc' : '#000'} />
          </TouchableOpacity>
          
          <View style={styles.headerIcons}>
            {favorites.length > 0 && (
              <View style={styles.favoriteIndicator}>
                <Ionicons name="heart" size={20} color="#FF6B9D" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{favorites.length}</Text>
                </View>
              </View>
            )}
            <TouchableOpacity onPress={() => router.push('/messages' as any)}>
              <Ionicons name="chatbubble-outline" size={24} color={isDark ? '#f4eddc' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color={isDark ? '#f4eddc' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={isDark ? '#f4eddc' : '#000'} />
            </TouchableOpacity>
          </View>
        </BlurView>

        <View style={styles.fixedTop}>
          <View style={styles.banner}>
            <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.bannerContent}>
              <Text style={[styles.bannerText, { color: isDark ? '#f4eddc' : '#000' }]}>Feito sob medida para você</Text>
            </BlurView>
          </View>

          <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#5f81a5" />
            <TextInput
              style={[styles.searchInput, { color: isDark ? '#f4eddc' : '#000' }]}
              placeholder="Buscar bazares..."
              placeholderTextColor="#5f81a5"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </BlurView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            {FILTERS.map(filter => (
              <BlurView
                key={filter.id}
                intensity={40}
                tint={isDark ? 'dark' : 'light'}
                style={styles.filterChip}
              >
                <Text style={[styles.filterText, { color: isDark ? '#f4eddc' : '#000' }]}>
                  {filter.label}
                </Text>
              </BlurView>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Carrossel Moda */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Moda</Text>
              <TouchableOpacity onPress={() => router.push('/all-bazares')}>
                <Text style={styles.seeMoreLink}>Ver Mais</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={getBazaresByCategory('moda')}
              renderItem={({ item }) => <BazarCardHorizontal {...item} />}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          {/* Carrossel Artesanato */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Artesanato</Text>
              <TouchableOpacity onPress={() => router.push('/all-bazares')}>
                <Text style={styles.seeMoreLink}>Ver Mais</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={getBazaresByCategory('artesanato')}
              renderItem={({ item }) => <BazarCardHorizontal {...item} />}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          {/* Carrossel Vintage */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Vintage</Text>
              <TouchableOpacity onPress={() => router.push('/all-bazares')}>
                <Text style={styles.seeMoreLink}>Ver Mais</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={getBazaresByCategory('vintage')}
              renderItem={({ item }) => <BazarCardHorizontal {...item} />}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          {/* Carrossel Decoração */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Decoração</Text>
              <TouchableOpacity onPress={() => router.push('/all-bazares')}>
                <Text style={styles.seeMoreLink}>Ver Mais</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={getBazaresByCategory('decoracao')}
              renderItem={({ item }) => <BazarCardHorizontal {...item} />}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
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
  fixedTop: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(95, 129, 165, 0.2)',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  favoriteIndicator: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B9D',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  banner: {
    height: 150,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(95, 129, 165, 0.3)',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
    maxHeight: 50,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    overflow: 'hidden',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeMoreLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f2c47',
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
});
