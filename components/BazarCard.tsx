import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

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

export default function BazarCard({ name, description, image, rating, location, isFavorite, onPress, onFavorite }: BazarCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />
      <TouchableOpacity style={styles.favoriteButton} onPress={onFavorite}>
        <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={Colors.light.primary} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={16} color={Colors.light.icon} />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.light.card,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: Colors.light.icon,
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
    color: Colors.light.text,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: Colors.light.icon,
  },
});
