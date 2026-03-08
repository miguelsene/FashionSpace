import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
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
  // Moda
  { id: '1', name: 'Bazar da Moda', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', rating: 4.8, location: 'São Paulo, SP', category: 'moda' },
  { id: '3', name: 'Fashion Space', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800', rating: 4.9, location: 'Belo Horizonte, MG', category: 'moda' },
  { id: '4', name: 'Brechó Chic', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', rating: 4.7, location: 'Curitiba, PR', category: 'moda' },
  { id: '7', name: 'Moda Urbana', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', rating: 4.6, location: 'Brasília, DF', category: 'moda' },
  { id: '8', name: 'Style Shop', image: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=800', rating: 4.5, location: 'Recife, PE', category: 'moda' },
  
  // Artesanato
  { id: '2', name: 'Estilo Único', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800', rating: 4.5, location: 'Rio de Janeiro, RJ', category: 'artesanato' },
  { id: '5', name: 'Arte & Estilo', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800', rating: 4.6, location: 'Porto Alegre, RS', category: 'artesanato' },
  { id: '9', name: 'Mãos de Ouro', image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800', rating: 4.7, location: 'Salvador, BA', category: 'artesanato' },
  { id: '10', name: 'Arte Popular', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800', rating: 4.4, location: 'Fortaleza, CE', category: 'artesanato' },
  { id: '11', name: 'Artesania', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800', rating: 4.8, location: 'Manaus, AM', category: 'artesanato' },
  
  // Vintage
  { id: '6', name: 'Decoração Chic', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800', rating: 4.4, location: 'Salvador, BA', category: 'vintage' },
  { id: '12', name: 'Retro Store', image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800', rating: 4.6, location: 'Florianópolis, SC', category: 'vintage' },
  { id: '13', name: 'Vintage Collection', image: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=800', rating: 4.7, location: 'Goiânia, GO', category: 'vintage' },
  { id: '14', name: 'Antiguidades', image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800', rating: 4.5, location: 'Belém, PA', category: 'vintage' },
  { id: '15', name: 'Nostalgia Shop', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800', rating: 4.8, location: 'Natal, RN', category: 'vintage' },
  
  // Decoração
  { id: '16', name: 'Casa & Estilo', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800', rating: 4.9, location: 'São Paulo, SP', category: 'decoracao' },
  { id: '17', name: 'Decor Home', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800', rating: 4.6, location: 'Rio de Janeiro, RJ', category: 'decoracao' },
  { id: '18', name: 'Ambiente Chic', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', rating: 4.7, location: 'Curitiba, PR', category: 'decoracao' },
  { id: '19', name: 'Design & Cia', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', rating: 4.5, location: 'Porto Alegre, RS', category: 'decoracao' },
  { id: '20', name: 'Espaço Decor', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', rating: 4.8, location: 'Belo Horizonte, MG', category: 'decoracao' },
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
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const { isDark, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const router = useRouter();

  const getBazaresByCategory = (category: string) => {
    return MOCK_BAZARES.filter(bazar => 
      bazar.category === category && 
      bazar.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredBazares = () => {
    let filtered = MOCK_BAZARES;
    
    if (selectedFilter !== 'todos') {
      filtered = filtered.filter(bazar => bazar.category === selectedFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(bazar => 
        bazar.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
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
            <TouchableOpacity onPress={() => router.push('/map' as any)}>
              <Ionicons name="map-outline" size={24} color={isDark ? '#f4eddc' : '#000'} />
            </TouchableOpacity>
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
              <TouchableOpacity
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <BlurView
                  intensity={selectedFilter === filter.id ? 60 : 40}
                  tint={isDark ? 'dark' : 'light'}
                  style={[
                    styles.filterChip,
                    selectedFilter === filter.id && styles.filterChipActive
                  ]}
                >
                  <Text style={[
                    styles.filterText,
                    { color: selectedFilter === filter.id ? '#0f2c47' : (isDark ? '#f4eddc' : '#000') }
                  ]}>
                    {filter.label}
                  </Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.banner}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80' }} 
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <BlurView intensity={30} tint="dark" style={styles.bannerOverlay}>
              <Text style={styles.bannerText}>Feito sob medida para você</Text>
            </BlurView>
          </View>
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
              initialNumToRender={2}
              maxToRenderPerBatch={2}
              windowSize={3}
              removeClippedSubviews={true}
              getItemLayout={(data, index) => (
                {length: 172, offset: 172 * index, index}
              )}
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
              initialNumToRender={2}
              maxToRenderPerBatch={2}
              windowSize={3}
              removeClippedSubviews={true}
              getItemLayout={(data, index) => (
                {length: 172, offset: 172 * index, index}
              )}
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
              initialNumToRender={2}
              maxToRenderPerBatch={2}
              windowSize={3}
              removeClippedSubviews={true}
              getItemLayout={(data, index) => (
                {length: 172, offset: 172 * index, index}
              )}
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
              initialNumToRender={2}
              maxToRenderPerBatch={2}
              windowSize={3}
              removeClippedSubviews={true}
              getItemLayout={(data, index) => (
                {length: 172, offset: 172 * index, index}
              )}
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
    height: 180,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bannerText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
  filterChipActive: {
    backgroundColor: 'rgba(15, 44, 71, 0.2)',
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
