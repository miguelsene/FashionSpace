import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

export default function WaveBackground() {
  const { isDark } = useTheme();
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(100, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0a1929' : '#f4eddc' }]}>
      <Animated.View style={[styles.wave, animatedStyle, { backgroundColor: isDark ? '#0f2c47' : '#5f81a5' }]} />
      <Animated.View style={[styles.wave2, animatedStyle, { backgroundColor: isDark ? '#1a3a5a' : '#0f2c47' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    width: '200%',
    height: 3,
    top: '20%',
    opacity: 0.3,
  },
  wave2: {
    position: 'absolute',
    width: '200%',
    height: 2,
    top: '40%',
    opacity: 0.2,
  },
});
