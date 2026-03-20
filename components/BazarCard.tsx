import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useRouter } from 'expo-router';

interface BazarCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  location: string;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavorite?: () => void;
}

const BazarCard = memo(({ id, name, description, image, rating, location }: BazarCardProps) => {
  const { isDark } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const fav = isFavorite(id);

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/bazar/${id}` as any)} activeOpacity={0.92}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        <View style={styles.imageOverlay} />
        <TouchableOpacity
          style={[styles.favoriteButton, fav && styles.favoriteButtonActive]}
          onPress={() => toggleFavorite(id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={18} color={fav ? '#FF6B9D' : '#fff'} />
        </TouchableOpacity>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={11} color="#FFD700" />
          <Text style={styles.ratingBadgeText}>{rating.toFixed(1)}</Text>
        </View>
      </View>

      <View style={[styles.content, { backgroundColor: isDark ? 'rgba(10,25,41,0.95)' : '#fff' }]}>
        <Text style={[styles.name, { color: isDark ? '#f4eddc' : '#1a1a2e' }]} numberOfLines={1}>{name}</Text>
        <Text style={styles.description} numberOfLines={1}>{description}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color="#5f81a5" />
          <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default BazarCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    background: 'transparent',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    padding: 6,
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 3,
  },
  ratingBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    color: '#5f81a5',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 11,
    color: '#5f81a5',
    flex: 1,
  },
});
