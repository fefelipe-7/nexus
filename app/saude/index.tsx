import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/components/common/ThemeProvider';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MetricCard } from '@/components/cards/MetricCard';
import { QuickActionButton } from '@/components/cards/QuickActionButton';
import { mockModules } from '@/data/mockModules';
import { spacing } from '@/design/spacing';
import { MetricCard as MetricCardType } from '@/types';

const data = mockModules['saude'];

export default function SaudeScreen() {
  const theme = useTheme();
  const metricCards = data.cards.filter((c): c is MetricCardType => 'value' in c);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>{data.title}</Text>
          <Text style={[styles.description, { color: theme.colors.text.secondary }]}>{data.description}</Text>
        </View>
        <SectionHeader title="Indicadores" />
        <View style={styles.cardsRow}>
          {metricCards.map(c => (
            <MetricCard key={c.id} title={c.title} value={c.value} subtitle={c.subtitle} color={c.color} />
          ))}
        </View>
        {data.quickActions.length > 0 && (
          <>
            <SectionHeader title="Ações rápidas" />
            <View style={styles.quickRow}>
              {data.quickActions.map(a => (
                <QuickActionButton key={a.id} title={a.title} icon={a.icon} color={a.color} onPress={a.action} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg },
  title: { fontSize: 28, fontWeight: '700' },
  description: { fontSize: 14, marginTop: spacing.xs },
  cardsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg },
});
