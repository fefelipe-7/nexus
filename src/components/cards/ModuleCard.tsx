import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AppCard } from '../cards/AppCard';
import { FontAwesome5 } from '@expo/vector-icons';
import { darkTheme } from '@design/theme';
import { typography } from '@design/typography';
import { spacing } from '@design/spacing';

type Props = {
  title: string;
  description: string;
  icon: string;
  color: string;
  module: string; // route name
};

export const ModuleCard: React.FC<Props> = ({ title, description, icon, color, module }) => {
  const router = useRouter();
  const handlePress = () => router.push(`/${module}`);
  return (
    <AppCard onPress={handlePress} style={{ backgroundColor: color }}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <FontAwesome5 name={icon as any} size={24} color={darkTheme.colors.text.inverse} style={styles.icon} />
    </AppCard>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.h3,
    color: darkTheme.colors.text.inverse,
  },
  description: {
    ...typography.caption,
    color: darkTheme.colors.text.inverse,
    marginVertical: spacing.xs,
  },
  icon: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },
});