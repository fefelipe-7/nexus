import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/components/common/ThemeProvider';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MetricCard } from '@/components/cards/MetricCard';
import { QuickActionButton } from '@/components/cards/QuickActionButton';
import { ModuleCard } from '@/components/cards/ModuleCard';
import { mockHome } from '@/data/mockHome';
import { spacing } from '@/design/spacing';

export default function HomeScreen() {
  const theme = useTheme();
  const { greeting, daySummary, metrics, quickActions, attentionSection, modulePreviews } = mockHome;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: theme.colors.text.primary }]}>{greeting}</Text>
          <Text style={[styles.daySummary, { color: theme.colors.text.secondary }]}>{daySummary}</Text>
        </View>

        <SectionHeader title="Indicadores" />
        <View style={styles.metricsRow}>
          {metrics.map(m => (
            <MetricCard
              key={m.id}
              title={m.title}
              value={m.value}
              subtitle={m.subtitle}
              trend={m.trend as 'up' | 'down' | undefined}
              color={m.color}
            />
          ))}
        </View>

        <SectionHeader title="Ações rápidas" />
        <View style={styles.quickRow}>
          {quickActions.map(a => (
            <QuickActionButton 
              key={a.id} 
              title={a.title} 
              icon={a.icon} 
              color={a.color} 
              onPress={a.action} 
            />
          ))}
        </View>

        <SectionHeader title={attentionSection.title} />
        {attentionSection.items.map((item, i) => (
          <View key={i} style={[styles.attentionItem, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <Text style={[styles.attentionTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
            <Text style={[styles.attentionDesc, { color: theme.colors.text.secondary }]}>{item.description}</Text>
          </View>
        ))}

        <SectionHeader title="Módulos" />
        {modulePreviews.map(m => (
          <ModuleCard
            key={m.id}
            title={m.title}
            description={m.description}
            icon={m.icon}
            color={m.color}
            module={m.module as any}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  greetingContainer: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
  },
  daySummary: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  attentionItem: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  attentionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  attentionDesc: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
