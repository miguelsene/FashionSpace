import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function WaveBackground() {
  const { isDark } = useTheme();
  const wave1 = useSharedValue(0);
  const wave2 = useSharedValue(0);
  const wave3 = useSharedValue(0);

  useEffect(() => {
    wave1.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    wave2.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    wave3.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedProps1 = useAnimatedProps(() => {
    const y = 300 + wave1.value * 20;
    return {
      d: `M0,${y} Q100,${y - 20} 200,${y} T400,${y} V800 H0 Z`,
    };
  });

  const animatedProps2 = useAnimatedProps(() => {
    const y = 350 + wave2.value * 15;
    return {
      d: `M0,${y} Q100,${y + 15} 200,${y} T400,${y} V800 H0 Z`,
    };
  });

  const animatedProps3 = useAnimatedProps(() => {
    const y = 400 + wave3.value * 10;
    return {
      d: `M0,${y} Q100,${y - 10} 200,${y} T400,${y} V800 H0 Z`,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0a1929' : '#f4eddc' }]}>
      <Svg height="100%" width="100%" style={styles.svg}>
        <AnimatedPath
          animatedProps={animatedProps1}
          fill={isDark ? 'rgba(15, 44, 71, 0.3)' : 'rgba(95, 129, 165, 0.15)'}
        />
        <AnimatedPath
          animatedProps={animatedProps2}
          fill={isDark ? 'rgba(26, 58, 90, 0.25)' : 'rgba(15, 44, 71, 0.1)'}
        />
        <AnimatedPath
          animatedProps={animatedProps3}
          fill={isDark ? 'rgba(95, 129, 165, 0.2)' : 'rgba(95, 129, 165, 0.08)'}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  svg: {
    position: 'absolute',
    bottom: 0,
  },
});
