import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { darkTheme } from '@design/theme';
import { spacing } from '@design/spacing';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export const ScreenContainer: React.FC<Props> = ({ children, style }) => (
  <SafeAreaView style={[styles.safeArea, style]}>{children}</SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
    padding: spacing.lg,
  },
});