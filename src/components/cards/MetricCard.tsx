import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from '../cards/AppCard';
import { typography } from '@design/typography';
import { darkTheme } from '@design/theme';
import { spacing } from '@design/spacing';

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down';
  color?: string;
};

export const MetricCard: React.FC<Props> = ({ title, value, subtitle, trend, color }) => (
  <AppCard style={{ backgroundColor: color ?? darkTheme.colors.surfaceElevated }}>
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  </AppCard>
);

const styles = StyleSheet.create({
  content: {
    alignItems: 'flex-start',
  },
  title: {
    ...typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  value: {
    ...typography.h2,
    color: darkTheme.colors.text.primary,
    marginVertical: spacing.xs,
  },
  subtitle: {
    ...typography.caption2,
    color: darkTheme.colors.text.tertiary,
  },
});