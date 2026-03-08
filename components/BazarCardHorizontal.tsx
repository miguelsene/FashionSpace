import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

interface BazarCardHorizontalProps {
  id: string;
  name: string;
  rating: number;
  image: string;
  location: string;
}

const BazarCardHorizontal = memo(({ id, name, rating, image, location }: BazarCardHorizontalProps) => {
  const { isDark } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/bazar/${id}`)}
    >
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(id)}>
        <Ionicons name={isFavorite(id) ? 'heart' : 'heart-outline'} size={20} color="#FF6B9D" />
      </TouchableOpacity>
      
      <View style={[styles.content, { backgroundColor: isDark ? 'rgba(15, 44, 71, 0.8)' : 'rgba(244, 237, 220, 0.8)' }]}>
        <Text style={[styles.name, { color: isDark ? '#f4eddc' : '#000' }]} numberOfLines={1}>{name}</Text>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.ratingText, { color: isDark ? '#f4eddc' : '#000' }]}>{rating.toFixed(1)}</Text>
          </View>
        </View>
        <View style={styles.location}>
          <Ionicons name="location-outline" size={12} color="#5f81a5" />
          <Text style={[styles.locationText, { color: '#5f81a5' }]} numberOfLines={1}>{location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default BazarCardHorizontal;

const styles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: 120,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 6,
  },
  content: {
    padding: 10,
    overflow: 'hidden',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rateText: {
    fontSize: 11,
    color: '#0f2c47',
    fontWeight: '600',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontSize: 10,
    flex: 1,
  },
});
