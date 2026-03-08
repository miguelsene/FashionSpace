import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import WaveBackground from '@/components/animated/WaveBackground';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import { ALL_BAZARES } from '@/constants/bazares';

// Coordenadas fictícias para os bazares
const BAZAR_LOCATIONS = ALL_BAZARES.map((bazar, index) => ({
  ...bazar,
  latitude: -23.5505 + (Math.random() - 0.5) * 0.1,
  longitude: -46.6333 + (Math.random() - 0.5) * 0.1,
}));

export default function MapScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDistance, setSelectedDistance] = useState<number>(10);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da sua localização para mostrar bazares próximos.');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoading(false);
    })();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getNearbyBazares = () => {
    if (!location) return [];
    
    return BAZAR_LOCATIONS
      .map(bazar => ({
        ...bazar,
        distance: calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          bazar.latitude,
          bazar.longitude
        )
      }))
      .filter(bazar => bazar.distance <= selectedDistance)
      .sort((a, b) => a.distance - b.distance);
  };

  const nearbyBazares = getNearbyBazares();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0a1929' : '#f4eddc' }]}>
      <WaveBackground />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={isDark ? '#f4eddc' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Bazares Próximos</Text>
          <View style={{ width: 28 }} />
        </BlurView>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5f81a5" />
            <Text style={[styles.loadingText, { color: isDark ? '#f4eddc' : '#000' }]}>
              Obtendo sua localização...
            </Text>
          </View>
        ) : !location ? (
          <View style={styles.errorContainer}>
            <Ionicons name="location-outline" size={64} color="#5f81a5" />
            <Text style={[styles.errorText, { color: isDark ? '#f4eddc' : '#000' }]}>
              Não foi possível obter sua localização
            </Text>
          </View>
        ) : (
          <View style={styles.content}>
            <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.filterCard}>
              <Text style={[styles.filterLabel, { color: isDark ? '#f4eddc' : '#000' }]}>
                Distância máxima: {selectedDistance} km
              </Text>
              <View style={styles.distanceButtons}>
                {[5, 10, 20, 50].map(distance => (
                  <TouchableOpacity
                    key={distance}
                    onPress={() => setSelectedDistance(distance)}
                    style={[
                      styles.distanceButton,
                      selectedDistance === distance && styles.distanceButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.distanceButtonText,
                      { color: selectedDistance === distance ? '#fff' : (isDark ? '#f4eddc' : '#000') }
                    ]}>
                      {distance} km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </BlurView>

            <Text style={[styles.resultText, { color: isDark ? '#f4eddc' : '#000' }]}>
              {nearbyBazares.length} bazares encontrados
            </Text>

            <View style={styles.bazaresList}>
              {nearbyBazares.map(bazar => (
                <TouchableOpacity
                  key={bazar.id}
                  onPress={() => router.push(`/bazar/${bazar.id}` as any)}
                >
                  <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.bazarCard}>
                    <View style={styles.bazarIcon}>
                      <Ionicons name="storefront" size={32} color="#5f81a5" />
                    </View>
                    <View style={styles.bazarInfo}>
                      <Text style={[styles.bazarName, { color: isDark ? '#f4eddc' : '#000' }]}>
                        {bazar.name}
                      </Text>
                      <Text style={[styles.bazarLocation, { color: '#5f81a5' }]}>
                        {bazar.location}
                      </Text>
                      <View style={styles.distanceContainer}>
                        <Ionicons name="navigate" size={16} color="#0f2c47" />
                        <Text style={styles.distanceText}>
                          {bazar.distance.toFixed(1)} km de distância
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#5f81a5" />
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  distanceButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  distanceButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(95, 129, 165, 0.2)',
    alignItems: 'center',
  },
  distanceButtonActive: {
    backgroundColor: '#0f2c47',
  },
  distanceButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  resultText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  bazaresList: {
    gap: 12,
  },
  bazarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    overflow: 'hidden',
    gap: 12,
  },
  bazarIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(95, 129, 165, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bazarInfo: {
    flex: 1,
  },
  bazarName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bazarLocation: {
    fontSize: 13,
    marginBottom: 6,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f2c47',
  },
});
