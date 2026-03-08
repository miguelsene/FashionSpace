import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import BazarCard from '@/components/BazarCard';
import WaveBackground from '@/components/animated/WaveBackground';
import { BlurView } from 'expo-blur';
import { ALL_BAZARES } from '@/constants/bazares';

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'moda', label: 'Moda' },
  { id: 'artesanato', label: 'Artesanato' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'decoracao', label: 'Decoração' },
];

export default function AllBazaresScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('todos');

  const filteredBazares = useMemo(() => {
    if (selectedFilter === 'todos') return ALL_BAZARES;
    return ALL_BAZARES.filter(bazar => bazar.category === selectedFilter);
  }, [selectedFilter]);

  const renderItem = useCallback(({ item }: { item: typeof ALL_BAZARES[0] }) => (
    <View style={styles.cardWrapper}>
      <BazarCard {...item} />
    </View>
  ), []);

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

        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            data={FILTERS}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedFilter(item.id)}>
                <BlurView
                  intensity={selectedFilter === item.id ? 60 : 40}
                  tint={isDark ? 'dark' : 'light'}
                  style={[
                    styles.filterChip,
                    selectedFilter === item.id && styles.filterChipActive
                  ]}
                >
                  <Text style={[
                    styles.filterText,
                    { color: selectedFilter === item.id ? '#0f2c47' : (isDark ? '#f4eddc' : '#000') }
                  ]}>
                    {item.label}
                  </Text>
                </BlurView>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>

        <FlatList
          data={filteredBazares}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          maxToRenderPerBatch={6}
          windowSize={5}
          removeClippedSubviews={true}
          initialNumToRender={6}
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
  filtersContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(95, 129, 165, 0.2)',
  },
  filtersList: {
    paddingHorizontal: 16,
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
