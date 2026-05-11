import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/components/common/ThemeProvider';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AppCard } from '@/components/cards/AppCard';
import { EntryForm } from '@/components/modals/EntryForm';
import { mockModules } from '@/data/mockModules';
import { spacing } from '@/design/spacing';
import { getEntriesBySubmodule, createEntry } from '@/data/repositories/entryRepository';
import { Entry } from '@/domain/models';

const data = mockModules['vida'];

const submoduleOptions = [
  { id: 'relacionamentos', name: 'Relacionamentos' },
  { id: 'familia', name: 'Família' },
  { id: 'social', name: 'Vida social' },
  { id: 'lazer', name: 'Lazer' },
  { id: 'aprendizado', name: 'Aprendizado' },
];

export default function VidaScreen() {
  const theme = useTheme();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const recent = await getEntriesBySubmodule('relacionamentos', 10);
      setEntries(recent);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleCreateEntry = async (formData: {
    submoduleId: string;
    title: string;
    description?: string;
    metrics: { key: string; value: string; unit?: string }[];
  }) => {
    await createEntry({
      moduleId: 'vida',
      submoduleId: formData.submoduleId,
      title: formData.title,
      description: formData.description,
      occurredAt: Date.now(),
      source: 'manual',
      metrics: formData.metrics.map(m => ({
        key: m.key,
        value: m.value,
        unit: m.unit,
      })),
    });
    loadEntries();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text.primary }]}>{data.title}</Text>
              <Text style={[styles.description, { color: theme.colors.text.secondary }]}>{data.description}</Text>
            </View>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.colors.accent?.violet || '#8B5CF6' }]}
              onPress={() => setShowForm(true)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SectionHeader title="Registros recentes" />
        {loading ? (
          <Text style={[styles.emptyText, { color: theme.colors.text.tertiary }]}>Carregando...</Text>
        ) : entries.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <Text style={[styles.emptyTitle, { color: theme.colors.text.secondary }]}>
              Nenhum registro ainda
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.colors.text.tertiary }]}>
              Toque em + para criar seu primeiro registro
            </Text>
          </View>
        ) : (
          entries.map(entry => (
            <AppCard key={entry.id} style={{ marginBottom: spacing.sm }}>
              <Text style={[styles.entryTitle, { color: theme.colors.text.primary }]}>{entry.title}</Text>
              {entry.description && (
                <Text style={[styles.entryDesc, { color: theme.colors.text.secondary }]}>
                  {entry.description}
                </Text>
              )}
              <Text style={[styles.entryDate, { color: theme.colors.text.tertiary }]}>
                {formatDate(entry.occurredAt)}
              </Text>
            </AppCard>
          ))
        )}

        <SectionHeader title="Submódulos" />
        <View style={styles.chipContainer}>
          {submoduleOptions.map(sub => (
            <TouchableOpacity
              key={sub.id}
              style={[styles.chip, { backgroundColor: theme.colors.surfaceSecondary, borderColor: theme.colors.border }]}
              onPress={() => {}}
            >
              <Text style={[styles.chipText, { color: theme.colors.text.secondary }]}>{sub.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <EntryForm
        visible={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateEntry}
        moduleId="vida"
        submodules={submoduleOptions}
        title="Novo registro - Vida"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: { fontSize: 28, fontWeight: '700' },
  description: { fontSize: 14, marginTop: spacing.xs },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  emptyCard: {
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', marginBottom: spacing.xs },
  emptyDesc: { fontSize: 14, textAlign: 'center' },
  emptyText: { fontSize: 14, marginBottom: spacing.lg },
  entryTitle: { fontSize: 16, fontWeight: '600', marginBottom: spacing.xs },
  entryDesc: { fontSize: 14, marginBottom: spacing.xs },
  entryDate: { fontSize: 12 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 14 },
});