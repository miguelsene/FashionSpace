import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { BlurView } from 'expo-blur';
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

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/bazar/${id}`)}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(id)}>
        <Ionicons name={isFavorite(id) ? 'heart' : 'heart-outline'} size={24} color="#FF6B9D" />
      </TouchableOpacity>
      
      <View style={[styles.content, { backgroundColor: isDark ? 'rgba(15, 44, 71, 0.8)' : 'rgba(244, 237, 220, 0.8)' }]}>
        <Text style={[styles.name, { color: isDark ? '#f4eddc' : '#000' }]}>{name}</Text>
        <Text style={[styles.description, { color: '#5f81a5' }]} numberOfLines={2}>{description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={[styles.ratingText, { color: isDark ? '#f4eddc' : '#000' }]}>{rating.toFixed(1)}</Text>
          </View>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#5f81a5" />
            <Text style={[styles.locationText, { color: '#5f81a5' }]} numberOfLines={1}>{location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default BazarCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: 200,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 16,
    overflow: 'hidden',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
  },
});
