import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { darkTheme } from '@design/theme';
import { typography } from '@design/typography';
import { spacing } from '@design/spacing';

type Props = {
  title: string;
  icon: string;
  color?: string;
  onPress: () => void;
};

export const QuickActionButton: React.FC<Props> = ({ title, icon, color, onPress }) => (
  <TouchableOpacity style={[styles.button, { backgroundColor: color ?? darkTheme.colors.surfaceSecondary }]} onPress={onPress}>
    <FontAwesome5 name={icon as any} size={20} color={darkTheme.colors.text.primary} />
    <Text style={styles.label}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  label: {
    ...typography.body,
    marginLeft: spacing.xs,
    color: darkTheme.colors.text.primary,
  },
});