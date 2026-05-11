import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import { useTheme } from '@/components/common/ThemeProvider';
import { spacing } from '@/design/spacing';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const login = useStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    
    // Mock login - em produção, chamar API
    setTimeout(() => {
      login('user-1');
      setIsLoading(false);
      router.replace('/');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>nexus</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Organize sua vida, conecte seus dados e revele sua evolução.
        </Text>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.surfaceSecondary,
                borderColor: theme.colors.border,
                color: theme.colors.text.primary
              }
            ]}
            placeholder="Email"
            placeholderTextColor={theme.colors.text.tertiary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.surfaceSecondary,
                borderColor: theme.colors.border,
                color: theme.colors.text.primary
              }
            ]}
            placeholder="Senha"
            placeholderTextColor={theme.colors.text.tertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.accent?.violet || '#8B5CF6' }]}
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={() => router.replace('/')}>
          <Text style={[styles.skipText, { color: theme.colors.text.tertiary }]}>
            Pular por agora
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xl * 2,
  },
  form: {
    gap: spacing.md,
  },
  input: {
    padding: spacing.md,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  button: {
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
  },
});
