import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, themeMode } = useStore();

  useEffect(() => {
    // Skip auth check for now - uncomment in production
    // if (!isAuthenticated) {
    //   router.replace('/auth/login');
    // }
  }, [isAuthenticated, router]);

  // Show loading while checking auth
  if (!isAuthenticated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09090b',
  },
});
