import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MetricCard } from '@/components/cards/MetricCard';
import { QuickActionButton } from '@/components/cards/QuickActionButton';
import { mockModules } from '@/data/mockModules';
import { spacing } from '@design/spacing';
import { darkTheme } from '@design/theme';

const data = mockModules['vida'];

export default function VidaScreen() {
  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>
        <SectionHeader title="Indicadores" />
        <View style={styles.cardsRow}>
          {data.cards.map(c => (
            <MetricCard key={c.id} title={c.title} value={c.value} subtitle={c.subtitle} color={c.color} />
          ))}
        </View>
        {/* Placeholder for quick actions */}
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
  title: { ...darkTheme.typography.h2, color: darkTheme.colors.text.primary },
  description: { ...darkTheme.typography.body, color: darkTheme.colors.text.secondary },
  cardsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg },
});