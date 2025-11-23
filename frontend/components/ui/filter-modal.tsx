import { CheckIcon } from '@/components/icons/check-icon';
import { Colors } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedButton } from './themed-button';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedFilter: string | null;
  onFilterSelect: (filter: string | null) => void;
}

const FILTER_OPTIONS = [
  { label: 'All Tasks', value: null },
  { label: 'To Do', value: 'To Do' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'In Review', value: 'In Review' },
  { label: 'Done', value: 'Done' },
];

export function FilterModal({ visible, onClose, selectedFilter, onFilterSelect }: FilterModalProps) {
  const [tempFilter, setTempFilter] = useState<string | null>(selectedFilter);

  const handleApply = () => {
    onFilterSelect(tempFilter);
    onClose();
  };

  const handleCancel = () => {
    setTempFilter(selectedFilter);
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setTempFilter(selectedFilter);
    }
  }, [visible, selectedFilter]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.modalHeader}>
          <ThemedButton variant="secondary" onPress={handleCancel}>
            Cancel
          </ThemedButton>

          <ThemedText type="H2">Filter Tasks</ThemedText>

          <ThemedButton variant="primary" onPress={handleApply}>
            Apply
          </ThemedButton>
        </ThemedView>
        
        <ThemedView style={styles.modalContent}>
          {FILTER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value || 'all'}
              style={styles.optionItem}
              onPress={() => setTempFilter(option.value)}
            >
              <ThemedText 
                type="Body2" 
                style={[
                  styles.optionText,
                  tempFilter === option.value && styles.selectedText
                ]}
              >
                {option.label}
              </ThemedText>
              {tempFilter === option.value && (
                <CheckIcon size={20} color={Colors.light.tint} />
              )}
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.cardBorder,
  },
  modalContent: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.card,
    borderColor: Colors.light.cardBorder,
    borderWidth: 0.5,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    flex: 1,
  },
  selectedText: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
});
