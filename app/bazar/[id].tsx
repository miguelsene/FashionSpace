import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Linking, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const BAZAR_DETAILS: Record<string, {
  name: string;
  images: string[];
  rating: number;
  location: string;
  description: string;
  hours: string;
  phone: string;
  coordinates: { lat: number; lng: number };
}> = {
  '1': {
    name: 'Bazar da Moda',
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
    ],
    rating: 4.8,
    location: 'Rua Augusta, 1234 - São Paulo, SP',
    description: 'Bazar especializado em roupas vintage e acessórios exclusivos. Peças únicas e de qualidade.',
    hours: 'Seg-Sex: 10h-19h | Sáb: 10h-18h',
    phone: '(11) 98765-4321',
    coordinates: { lat: -23.5505, lng: -46.6333 },
  },
};

export default function BazarDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [userRating, setUserRating] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bazar = BAZAR_DETAILS[id as string] || BAZAR_DETAILS['1'];

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${bazar.coordinates.lat},${bazar.coordinates.lng}`;
    Linking.openURL(url);
  };

  const handleSendMessage = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0a1929' : '#f4eddc' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageGallery}>
          <FlatList
            data={bazar.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          
          <SafeAreaView edges={['top']} style={styles.headerOverlay}>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(id as string)}>
                <Ionicons name={isFavorite(id as string) ? 'heart' : 'heart-outline'} size={24} color="#FF6B9D" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <View style={styles.pagination}>
            {bazar.images.map((_: string, index: number) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
        </View>

        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.infoCard}>
          <Text style={[styles.name, { color: isDark ? '#f4eddc' : '#000' }]}>{bazar.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={[styles.rating, { color: isDark ? '#f4eddc' : '#000' }]}>{bazar.rating}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#5f81a5" />
            <Text style={[styles.infoText, { color: isDark ? '#f4eddc' : '#000' }]}>{bazar.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#5f81a5" />
            <Text style={[styles.infoText, { color: isDark ? '#f4eddc' : '#000' }]}>{bazar.hours}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color="#5f81a5" />
            <Text style={[styles.infoText, { color: isDark ? '#f4eddc' : '#000' }]}>{bazar.phone}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
              <Ionicons name="map" size={20} color="#fff" />
              <Text style={styles.mapButtonText}>Ver no Mapa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.messageButton} onPress={handleSendMessage}>
              <Ionicons name="chatbubble" size={20} color="#fff" />
              <Text style={styles.messageButtonText}>Enviar Mensagem</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Sobre</Text>
          <Text style={[styles.description, { color: '#5f81a5' }]}>{bazar.description}</Text>

          <Text style={[styles.sectionTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Avaliar</Text>
          <View style={styles.rateContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                <Ionicons 
                  name={star <= userRating ? 'star' : 'star-outline'} 
                  size={32} 
                  color="#FFD700" 
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Avaliações</Text>
          <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Ionicons name="person-circle" size={40} color="#5f81a5" />
              <View style={styles.reviewInfo}>
                <Text style={[styles.reviewName, { color: isDark ? '#f4eddc' : '#000' }]}>João Silva</Text>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Ionicons key={star} name="star" size={12} color="#FFD700" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={[styles.reviewText, { color: '#5f81a5' }]}>
              Excelente bazar! Encontrei peças únicas e o atendimento foi ótimo.
            </Text>
          </View>
        </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageGallery: {
    height: 400,
    position: 'relative',
  },
  image: {
    width,
    height: 400,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  infoCard: {
    padding: 20,
    minHeight: 500,
    overflow: 'hidden',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  rating: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f2c47',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5f81a5',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  messageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  rateContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(95, 129, 165, 0.2)',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
