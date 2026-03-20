import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function SkeletonCard() {
  const { isDark } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });
  const base = isDark ? '#1a3a5a' : '#e0d8cc';
  const shine = isDark ? '#2a4a6a' : '#ede6d8';

  return (
    <Animated.View style={[styles.card, { backgroundColor: base, opacity }]}>
      <View style={[styles.image, { backgroundColor: shine }]} />
      <View style={styles.content}>
        <View style={[styles.line, { backgroundColor: shine, width: '70%' }]} />
        <View style={[styles.line, { backgroundColor: shine, width: '50%', marginTop: 6 }]} />
        <View style={[styles.lineSmall, { backgroundColor: shine, width: '40%', marginTop: 8 }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, marginBottom: 14, overflow: 'hidden' },
  image: { width: '100%', height: 140 },
  content: { padding: 12 },
  line: { height: 14, borderRadius: 7 },
  lineSmall: { height: 10, borderRadius: 5 },
});
