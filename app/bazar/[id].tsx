import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Linking, FlatList, Dimensions, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useHistory } from '@/contexts/HistoryContext';
import { BlurView } from 'expo-blur';
import { ALL_BAZARES } from '@/constants/bazares';

const { width } = Dimensions.get('window');

const PHONES: Record<string, string> = {
  '1': '(11) 98765-4321', '2': '(21) 97654-3210', '3': '(31) 96543-2109',
  '4': '(41) 95432-1098', '5': '(51) 94321-0987', '6': '(71) 93210-9876',
  '7': '(61) 92109-8765', '8': '(81) 91098-7654', '9': '(71) 90987-6543',
  '10': '(85) 99876-5432', '11': '(92) 98765-4321', '12': '(48) 97654-3210',
  '13': '(62) 96543-2109', '14': '(91) 95432-1098', '15': '(84) 94321-0987',
  '16': '(11) 93210-9876', '17': '(21) 92109-8765', '18': '(41) 91098-7654',
  '19': '(51) 90987-6543', '20': '(31) 99876-5432',
};

const HOURS: Record<string, string> = {
  '1': 'Seg-Sex: 10h-19h | Sáb: 10h-18h', '2': 'Ter-Dom: 11h-20h',
  '3': 'Seg-Sáb: 9h-18h', '4': 'Qua-Dom: 10h-19h',
  '5': 'Seg-Sex: 10h-18h | Sáb: 9h-17h', '6': 'Ter-Sáb: 11h-19h',
  '7': 'Seg-Sex: 9h-20h', '8': 'Seg-Dom: 10h-21h',
  '9': 'Qua-Dom: 10h-18h', '10': 'Ter-Sáb: 9h-17h',
  '11': 'Seg-Sex: 10h-19h', '12': 'Qui-Dom: 11h-20h',
  '13': 'Seg-Sáb: 10h-18h', '14': 'Ter-Dom: 9h-17h',
  '15': 'Seg-Sex: 10h-19h | Sáb: 10h-16h', '16': 'Seg-Dom: 10h-20h',
  '17': 'Ter-Dom: 11h-19h', '18': 'Seg-Sáb: 9h-18h',
  '19': 'Qua-Dom: 10h-19h', '20': 'Seg-Sex: 9h-18h | Sáb: 10h-17h',
};

const COORDS: Record<string, { lat: number; lng: number }> = {
  '1': { lat: -23.5505, lng: -46.6333 }, '2': { lat: -22.9068, lng: -43.1729 },
  '3': { lat: -19.9167, lng: -43.9345 }, '4': { lat: -25.4284, lng: -49.2733 },
  '5': { lat: -30.0346, lng: -51.2177 }, '6': { lat: -12.9714, lng: -38.5014 },
  '7': { lat: -15.7801, lng: -47.9292 }, '8': { lat: -8.0476, lng: -34.8770 },
  '9': { lat: -12.9714, lng: -38.5014 }, '10': { lat: -3.7172, lng: -38.5433 },
  '11': { lat: -3.1190, lng: -60.0217 }, '12': { lat: -27.5954, lng: -48.5480 },
  '13': { lat: -16.6869, lng: -49.2648 }, '14': { lat: -1.4558, lng: -48.5044 },
  '15': { lat: -5.7945, lng: -35.2110 }, '16': { lat: -23.5505, lng: -46.6333 },
  '17': { lat: -22.9068, lng: -43.1729 }, '18': { lat: -25.4284, lng: -49.2733 },
  '19': { lat: -30.0346, lng: -51.2177 }, '20': { lat: -19.9167, lng: -43.9345 },
};

const REVIEWS: Record<string, { user: string; text: string; stars: number }[]> = {
  default: [
    { user: 'Maria Silva', text: 'Peças incríveis e atendimento excelente! Voltarei com certeza.', stars: 5 },
    { user: 'João Santos', text: 'Ótima variedade e preços justos. Recomendo!', stars: 4 },
  ],
};

export default function BazarDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToHistory } = useHistory();
  const [userRating, setUserRating] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bazarBase = ALL_BAZARES.find(b => b.id === id) || ALL_BAZARES[0];
  const sid = id as string;

  const bazar = {
    ...bazarBase,
    images: [bazarBase.image, ...ALL_BAZARES.filter(b => b.category === bazarBase.category && b.id !== sid).slice(0, 3).map(b => b.image)],
    phone: PHONES[sid] || PHONES['1'],
    hours: HOURS[sid] || HOURS['1'],
    coordinates: COORDS[sid] || COORDS['1'],
  };

  const reviews = REVIEWS[sid] || REVIEWS['default'];

  useEffect(() => { addToHistory(sid); }, [sid]);

  const textColor = isDark ? '#f4eddc' : '#1a1a2e';
  const subColor = isDark ? '#a0b4c8' : '#5f81a5';

  const openMaps = () => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${bazar.coordinates.lat},${bazar.coordinates.lng}`);
  };

  const handleShare = async () => {
    await Share.share({
      message: `Confira o ${bazar.name}!\n${bazar.description}\n${bazar.location}`,
      title: bazar.name,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0a1929' : '#f4eddc' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Galeria */}
        <View style={styles.gallery}>
          <FlatList
            data={bazar.images}
            horizontal pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => setCurrentImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
            keyExtractor={(_, i) => i.toString()}
          />
          <SafeAreaView edges={['top']} style={styles.headerOverlay}>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <View style={styles.rightActions}>
                <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                  <Ionicons name="share-outline" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, isFavorite(sid) && styles.iconBtnFav]} onPress={() => toggleFavorite(sid)}>
                  <Ionicons name={isFavorite(sid) ? 'heart' : 'heart-outline'} size={22} color={isFavorite(sid) ? '#FF6B9D' : '#fff'} />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
          <View style={styles.pagination}>
            {bazar.images.map((_, i) => (
              <View key={i} style={[styles.dot, i === currentImageIndex && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Info */}
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.infoCard}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: textColor }]}>{bazar.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{bazar.rating.toFixed(1)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color={subColor} />
            <Text style={[styles.infoText, { color: textColor }]}>{bazar.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color={subColor} />
            <Text style={[styles.infoText, { color: textColor }]}>{bazar.hours}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color={subColor} />
            <Text style={[styles.infoText, { color: textColor }]}>{bazar.phone}</Text>
          </View>

          <View style={styles.actionBtns}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#0f2c47' }]} onPress={openMaps}>
              <Ionicons name="map" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Ver no Mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#5f81a5' }]} onPress={() => router.push(`/chat/${sid}` as any)}>
              <Ionicons name="chatbubble" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Mensagem</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { color: textColor }]}>Sobre</Text>
          <Text style={[styles.description, { color: subColor }]}>{bazar.description}</Text>

          <Text style={[styles.sectionTitle, { color: textColor }]}>Sua Avaliação</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(s => (
              <TouchableOpacity key={s} onPress={() => setUserRating(s)}>
                <Ionicons name={s <= userRating ? 'star' : 'star-outline'} size={34} color="#FFD700" />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: textColor }]}>Avaliações</Text>
          {reviews.map((r, i) => (
            <View key={i} style={[styles.reviewCard, { borderBottomColor: 'rgba(95,129,165,0.15)' }]}>
              <View style={styles.reviewTop}>
                <View style={[styles.reviewAvatar, { backgroundColor: isDark ? 'rgba(95,129,165,0.2)' : 'rgba(15,44,71,0.08)' }]}>
                  <Ionicons name="person" size={20} color={subColor} />
                </View>
                <View>
                  <Text style={[styles.reviewUser, { color: textColor }]}>{r.user}</Text>
                  <View style={styles.starsRowSmall}>
                    {[1,2,3,4,5].map(s => <Ionicons key={s} name={s <= r.stars ? 'star' : 'star-outline'} size={12} color="#FFD700" />)}
                  </View>
                </View>
              </View>
              <Text style={[styles.reviewText, { color: subColor }]}>{r.text}</Text>
            </View>
          ))}
        </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gallery: { height: 380, position: 'relative' },
  image: { width, height: 380 },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
  iconBtn: { backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 20, padding: 9 },
  iconBtnFav: { backgroundColor: 'rgba(255,255,255,0.9)' },
  rightActions: { flexDirection: 'row', gap: 8 },
  pagination: { position: 'absolute', bottom: 16, flexDirection: 'row', alignSelf: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#fff', width: 22 },
  infoCard: { padding: 22, overflow: 'hidden', paddingBottom: 40 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  name: { fontSize: 26, fontWeight: '800', flex: 1 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, gap: 4 },
  ratingText: { fontSize: 15, fontWeight: '700', color: '#b8860b' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  infoText: { fontSize: 14, flex: 1 },
  actionBtns: { flexDirection: 'row', gap: 12, marginTop: 18, marginBottom: 24 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 14, gap: 8 },
  actionBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginTop: 20, marginBottom: 10 },
  description: { fontSize: 14, lineHeight: 22 },
  starsRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  starsRowSmall: { flexDirection: 'row', gap: 2 },
  reviewCard: { paddingVertical: 14, borderBottomWidth: 1 },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  reviewAvatar: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  reviewUser: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  reviewText: { fontSize: 13, lineHeight: 20 },
});
