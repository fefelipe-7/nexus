import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { useTheme } from './ThemeProvider';
import { spacing } from '@/design/spacing';
import { radius } from '@/design/radius';

interface SubmoduleOption {
  id: string;
  name: string;
}

interface EntryFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { submoduleId: string; title: string; description?: string; metrics: { key: string; value: string; unit?: string }[] }) => void;
  moduleId: string;
  submodules: SubmoduleOption[];
  title?: string;
}

export function EntryForm({ visible, onClose, onSubmit, moduleId, submodules, title = 'Novo registro' }: EntryFormProps) {
  const theme = useTheme();
  const [selectedSubmodule, setSelectedSubmodule] = useState(submodules[0]?.id || '');
  const [entryTitle, setEntryTitle] = useState('');
  const [entryDescription, setEntryDescription] = useState('');
  const [metrics, setMetrics] = useState<{ key: string; value: string; unit?: string }[]>([]);

  const handleSubmit = () => {
    if (!entryTitle.trim()) return;
    onSubmit({
      submoduleId: selectedSubmodule,
      title: entryTitle.trim(),
      description: entryDescription.trim() || undefined,
      metrics,
    });
    setEntryTitle('');
    setEntryDescription('');
    setMetrics([]);
    onClose();
  };

  const addMetric = () => {
    setMetrics([...metrics, { key: '', value: '', unit: '' }]);
  };

  const updateMetric = (index: number, field: 'key' | 'value' | 'unit', value: string) => {
    const updated = [...metrics];
    updated[index][field] = value;
    setMetrics(updated);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.text.primary }]}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={[styles.closeText, { color: theme.colors.text.tertiary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Submódulo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
              {submodules.map(sub => (
                <TouchableOpacity
                  key={sub.id}
                  onPress={() => setSelectedSubmodule(sub.id)}
                  style={[
                    styles.chip,
                    { 
                      backgroundColor: selectedSubmodule === sub.id 
                        ? theme.colors.accent?.violet || '#8B5CF6'
                        : theme.colors.surfaceSecondary,
                      borderColor: theme.colors.border,
                    }
                  ]}
                >
                  <Text style={[
                    styles.chipText,
                    { color: selectedSubmodule === sub.id ? '#fff' : theme.colors.text.secondary }
                  ]}>
                    {sub.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Título</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.surfaceSecondary,
                  borderColor: theme.colors.border,
                  color: theme.colors.text.primary,
                }
              ]}
              placeholder="O que você quer registrar?"
              placeholderTextColor={theme.colors.text.tertiary}
              value={entryTitle}
              onChangeText={setEntryTitle}
            />

            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Descrição (opcional)</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { 
                  backgroundColor: theme.colors.surfaceSecondary,
                  borderColor: theme.colors.border,
                  color: theme.colors.text.primary,
                }
              ]}
              placeholder="Detalhes ou observações..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={entryDescription}
              onChangeText={setEntryDescription}
              multiline
              numberOfLines={3}
            />

            <View style={styles.metricsHeader}>
              <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Métricas (opcional)</Text>
              <TouchableOpacity onPress={addMetric}>
                <Text style={[styles.addButton, { color: theme.colors.accent?.violet || '#8B5CF6' }]}>
                  + Adicionar
                </Text>
              </TouchableOpacity>
            </View>

            {metrics.map((metric, index) => (
              <View key={index} style={styles.metricRow}>
                <TextInput
                  style={[styles.metricInput, { backgroundColor: theme.colors.surfaceSecondary, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                  placeholder="Chave (ex: horas)"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={metric.key}
                  onChangeText={(v) => updateMetric(index, 'key', v)}
                />
                <TextInput
                  style={[styles.metricInputSmall, { backgroundColor: theme.colors.surfaceSecondary, borderColor: theme.colors.border, color: theme.colors.text.primary }]}
                  placeholder="Valor"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={metric.value}
                  onChangeText={(v) => updateMetric(index, 'value', v)}
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={() => removeMetric(index)}>
                  <Text style={{ color: theme.colors.semantic?.error || '#EF4444' }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.colors.accent?.violet || '#8B5CF6' }]}
              onPress={handleSubmit}
              disabled={!entryTitle.trim()}
            >
              <Text style={styles.submitText}>Salvar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeText: {
    fontSize: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
  },
  input: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  addButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  metricInput: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    color: '#fff',
    fontSize: 14,
  },
  metricInputSmall: {
    width: 80,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    color: '#fff',
    fontSize: 14,
  },
  submitButton: {
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});