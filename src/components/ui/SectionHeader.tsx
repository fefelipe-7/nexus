import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { darkTheme } from '@design/theme';
import { typography } from '@design/typography';

type Props = {
  title: string;
};

export const SectionHeader: React.FC<Props> = ({ title }) => (
  <Text style={styles.title}>{title}</Text>
);

const styles = StyleSheet.create({
  title: {
    ...typography.h3,
    color: darkTheme.colors.text.primary,
    marginBottom: 8,
  },
});