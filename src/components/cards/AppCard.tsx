import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { radius, spacing } from '../../design';
import { darkTheme } from '@design/theme';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

export const AppCard: React.FC<Props> = ({ children, onPress, style }) => {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container style={[styles.card, style]} onPress={onPress as any} activeOpacity={0.8}>
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: darkTheme.colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});