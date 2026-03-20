import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import BazarCard from '@/components/BazarCard';
import WaveBackground from '@/components/animated/WaveBackground';
import { BlurView } from 'expo-blur';
import { ALL_BAZARES } from '@/constants/bazares';

const FILTERS = [
  { id: 'todos', label: 'Todos', icon: 'grid-outline' },
  { id: 'moda', label: 'Moda', icon: 'shirt-outline' },
  { id: 'artesanato', label: 'Artesanato', icon: 'color-palette-outline' },
  { id: 'vintage', label: 'Vintage', icon: 'time-outline' },
  { id: 'decoracao', label: 'Decoração', icon: 'home-outline' },
];

export default function AllBazaresScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [search, setSearch] = useState('');

  const filteredBazares = useMemo(() => {
    let list = selectedFilter === 'todos' ? ALL_BAZARES : ALL_BAZARES.filter(b => b.category === selectedFilter);
    if (search.trim()) list = list.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [selectedFilter, search]);

  const textColor = isDark ? '#f4eddc' : '#1a1a2e';
  const subColor = isDark ? '#a0b4c8' : '#5f81a5';

  const renderItem = useCallback(({ item }: { item: typeof ALL_BAZARES[0] }) => (
    <View style={styles.cardWrapper}>
      <BazarCard {...item} />
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <WaveBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: textColor }]}>Bazares</Text>
            <Text style={[styles.headerSub, { color: subColor }]}>{filteredBazares.length} encontrados</Text>
          </View>
          <View style={{ width: 40 }} />
        </BlurView>

        {/* Search */}
        <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.searchBar}>
          <Ionicons name="search" size={18} color={subColor} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Buscar bazares..."
            placeholderTextColor={subColor}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={subColor} />
            </TouchableOpacity>
          )}
        </BlurView>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            data={FILTERS}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const active = selectedFilter === item.id;
              return (
                <TouchableOpacity onPress={() => setSelectedFilter(item.id)} style={styles.filterTouchable}>
                  <BlurView
                    intensity={active ? 70 : 40}
                    tint={isDark ? 'dark' : 'light'}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                  >
                    <Ionicons name={item.icon as any} size={14} color={active ? '#fff' : subColor} />
                    <Text style={[styles.filterText, { color: active ? '#fff' : textColor }]}>
                      {item.label}
                    </Text>
                  </BlurView>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Grid */}
        {filteredBazares.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={56} color={subColor} />
            <Text style={[styles.emptyText, { color: subColor }]}>Nenhum bazar encontrado</Text>
          </View>
        ) : (
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
            removeClippedSubviews
            initialNumToRender={6}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(95,129,165,0.2)',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  headerSub: { fontSize: 12, marginTop: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    overflow: 'hidden',
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15 },
  filtersContainer: { paddingVertical: 10 },
  filtersList: { paddingHorizontal: 16, gap: 8 },
  filterTouchable: {},
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    gap: 5,
  },
  filterChipActive: { backgroundColor: 'rgba(15,44,71,0.6)' },
  filterText: { fontSize: 13, fontWeight: '600' },
  content: { padding: 8, paddingBottom: 24 },
  row: { justifyContent: 'space-between', paddingHorizontal: 8 },
  cardWrapper: { flex: 1, maxWidth: '48%', marginHorizontal: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 16 },
});
