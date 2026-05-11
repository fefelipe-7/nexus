import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MetricCard } from '@/components/cards/MetricCard';
import { QuickActionButton } from '@/components/cards/QuickActionButton';
import { ModuleCard } from '@/components/cards/ModuleCard';
import { mockHome } from '@/data/mockHome';
import { spacing } from '@design/spacing';
import { darkTheme } from '@design/theme';

export default function HomeScreen() {
  const { greeting, daySummary, metrics, quickActions, attentionSection, modulePreviews } = mockHome;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.daySummary}>{daySummary}</Text>
        </View>

        {/* Metrics */}
        <SectionHeader title="Indicadores" />
        <View style={styles.metricsRow}>
          {metrics.map(m => (
            <MetricCard
              key={m.id}
              title={m.title}
              value={m.value}
              subtitle={m.subtitle}
              trend={m.trend}
              color={m.color}
            />
          ))}
        </View>

        {/* Quick actions */}
        <SectionHeader title="Ações rápidas" />
        <View style={styles.quickRow}>
          {quickActions.map(a => (
            <QuickActionButton key={a.id} title={a.title} icon={a.icon} color={a.color} onPress={a.action} />
          ))}
        </View>

        {/* Attention section */}
        <SectionHeader title={attentionSection.title} />
        {attentionSection.items.map((item, i) => (
          <View key={i} style={styles.attentionItem}>
            <Text style={styles.attentionTitle}>{item.title}</Text>
            <Text style={styles.attentionDesc}>{item.description}</Text>
          </View>
        ))}

        {/* Module previews */}
        <SectionHeader title="Módulos" />
        {modulePreviews.map(m => (
          <ModuleCard
            key={m.id}
            title={m.title}
            description={m.description}
            icon={m.icon}
            color={m.color}
            module={m.module}
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
    ...darkTheme.typography.h2,
    color: darkTheme.colors.text.primary,
  },
  daySummary: {
    ...darkTheme.typography.body,
    color: darkTheme.colors.text.secondary,
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
    backgroundColor: darkTheme.colors.surfaceSecondary,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  attentionTitle: {
    ...darkTheme.typography.bodyBold,
    color: darkTheme.colors.text.primary,
  },
  attentionDesc: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
});