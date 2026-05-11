import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useStore } from '@/store/useStore';
import { useTheme } from '@/components/common/ThemeProvider';
import { spacing } from '@/design/spacing';
import { SectionHeader } from '@/components/ui/SectionHeader';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { themeMode, toggleTheme, isAuthenticated, logout } = useStore();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  const isDark = themeMode === 'dark';

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Configurações</Text>

        <SectionHeader title="Aparência" />
        <View style={[styles.card, { backgroundColor: theme.colors.surfaceSecondary }]}>
          <View style={styles.row}>
            <Text style={[styles.rowText, { color: theme.colors.text.primary }]}>
              Tema escuro
            </Text>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent?.violet || '#8B5CF6' }}
              thumbColor={themeMode === 'dark' ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <SectionHeader title="Conta" />
        <View style={[styles.card, { backgroundColor: theme.colors.surfaceSecondary }]}>
          <TouchableOpacity style={styles.row} onPress={() => {}}>
            <Text style={[styles.rowText, { color: theme.colors.text.primary }]}>
              Perfil
            </Text>
            <Text style={[styles.rowValue, { color: theme.colors.text.tertiary }]}>
              →
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.row} onPress={() => {}}>
            <Text style={[styles.rowText, { color: theme.colors.text.primary }]}>
              Privacidade
            </Text>
            <Text style={[styles.rowValue, { color: theme.colors.text.tertiary }]}>
              →
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.row} onPress={() => {}}>
            <Text style={[styles.rowText, { color: theme.colors.text.primary }]}>
              Exportar dados
            </Text>
            <Text style={[styles.rowValue, { color: theme.colors.text.tertiary }]}>
              →
            </Text>
          </TouchableOpacity>
        </View>

        <SectionHeader title="Sobre" />
        <View style={[styles.card, { backgroundColor: theme.colors.surfaceSecondary }]}>
          <View style={styles.row}>
            <Text style={[styles.rowText, { color: theme.colors.text.primary }]}>
              Versão
            </Text>
            <Text style={[styles.rowValue, { color: theme.colors.text.tertiary }]}>
              1.0.0
            </Text>
          </View>
        </View>

        {isAuthenticated && (
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: '#EF4444' }]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rowText: {
    fontSize: 16,
  },
  rowValue: {
    fontSize: 16,
  },
  logoutButton: {
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
