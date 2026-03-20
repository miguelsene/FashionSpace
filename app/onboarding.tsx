import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import WaveBackground from '@/components/animated/WaveBackground';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'storefront',
    title: 'Descubra Bazares',
    subtitle: 'Encontre bazares incríveis de moda, artesanato, vintage e decoração perto de você.',
    color: '#0f2c47',
  },
  {
    id: '2',
    icon: 'location',
    title: 'Bazares Próximos',
    subtitle: 'Use sua localização para encontrar os melhores bazares na sua cidade em tempo real.',
    color: '#5f81a5',
  },
  {
    id: '3',
    icon: 'heart',
    title: 'Salve Favoritos',
    subtitle: 'Guarde seus bazares preferidos e nunca perca uma promoção ou evento especial.',
    color: '#FF6B9D',
  },
  {
    id: '4',
    icon: 'chatbubbles',
    title: 'Converse Direto',
    subtitle: 'Fale com os vendedores, tire dúvidas e negocie diretamente pelo app.',
    color: '#0f2c47',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [current, setCurrent] = useState(0);
  const listRef = useRef<FlatList>(null);

  const textColor = isDark ? '#f4eddc' : '#1a1a2e';
  const subColor = isDark ? '#a0b4c8' : '#5f81a5';

  const finish = async () => {
    await AsyncStorage.setItem('onboarding_done', '1');
    router.replace('/login');
  };

  const next = () => {
    if (current < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: current + 1 });
      setCurrent(current + 1);
    } else {
      finish();
    }
  };

  return (
    <View style={styles.container}>
      <WaveBackground />

      <TouchableOpacity style={styles.skipBtn} onPress={finish}>
        <Text style={[styles.skipText, { color: subColor }]}>Pular</Text>
      </TouchableOpacity>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.iconCircle, { backgroundColor: item.color + '22', borderColor: item.color + '44' }]}>
              <Ionicons name={item.icon as any} size={72} color={item.color} />
            </View>
            <Text style={[styles.slideTitle, { color: textColor }]}>{item.title}</Text>
            <Text style={[styles.slideSubtitle, { color: subColor }]}>{item.subtitle}</Text>
          </View>
        )}
      />

      <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={styles.bottom}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === current ? '#0f2c47' : 'rgba(95,129,165,0.4)' },
                i === current && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={next}>
          <Text style={styles.nextBtnText}>
            {current === SLIDES.length - 1 ? 'Começar' : 'Próximo'}
          </Text>
          <Ionicons name={current === SLIDES.length - 1 ? 'checkmark' : 'arrow-forward'} size={20} color="#fff" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: { position: 'absolute', top: 60, right: 24, zIndex: 10, padding: 8 },
  skipText: { fontSize: 15, fontWeight: '600' },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 160,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
  },
  slideTitle: { fontSize: 30, fontWeight: '900', textAlign: 'center', marginBottom: 16 },
  slideSubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 26 },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 32,
    paddingBottom: 48,
    overflow: 'hidden',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 24,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 24 },
  nextBtn: {
    backgroundColor: '#0f2c47',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0f2c47',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
