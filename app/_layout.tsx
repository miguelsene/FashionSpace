import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider as CustomThemeProvider } from '@/contexts/ThemeContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { HistoryProvider } from '@/contexts/HistoryContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <CustomThemeProvider>
        <FavoritesProvider>
          <HistoryProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="bazar/[id]" />
              <Stack.Screen name="chat/[id]" />
              <Stack.Screen name="all-bazares" />
              <Stack.Screen name="map" />
              <Stack.Screen name="privacy" />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="address" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
          </HistoryProvider>
        </FavoritesProvider>
      </CustomThemeProvider>
    </AuthProvider>
  );
}
