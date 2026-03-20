import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      (async () => {
        const done = await AsyncStorage.getItem('onboarding_done');
        if (!done) {
          router.replace('/onboarding');
        } else if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      })();
    }
  }, [user, isLoading]);

  if (isLoading) return <LoadingScreen />;
  return null;
}
