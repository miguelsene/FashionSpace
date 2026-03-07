import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import BazarCard from '@/components/BazarCard';
import WaveBackground from '@/components/animated/WaveBackground';
import { BlurView } from 'expo-blur';

const ALL_BAZARES = [
  { id: '1', name: 'Bazar da Moda', description: 'Roupas vintage e acessórios exclusivos', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', rating: 4.8, location: 'São Paulo, SP' },
  { id: '2', name: 'Estilo Único', description: 'Peças artesanais e decoração', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800', rating: 4.5, location: 'Rio de Janeiro, RJ' },
  { id: '3', name: 'Fashion Space', description: 'Moda sustentável e consciente', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800', rating: 4.9, location: 'Belo Horizonte, MG' },
  { id: '4', name: 'Brechó Chic', description: 'Roupas de marca com preços acessíveis', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', rating: 4.7, location: 'Curitiba, PR' },
  { id: '5', name: 'Arte & Estilo', description: 'Artesanato e peças únicas', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800', rating: 4.6, location: 'Porto Alegre, RS' },
  { id: '6', name: 'Vintage Store', description: 'Antiguidades e colecionáveis', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800', rating: 4.4, location: 'Salvador, BA' },
];

export default function AllBazaresScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <View style={styles.container}>
      <WaveBackground />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={isDark ? '#f4eddc' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Todos os Bazares</Text>
          <View style={{ width: 28 }} />
        </BlurView>

        <FlatList
          data={ALL_BAZARES}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(95, 129, 165, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
});
