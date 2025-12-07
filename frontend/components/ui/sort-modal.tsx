import { CheckIcon } from '@/components/icons/check-icon';
import { Colors } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ThemedButton } from './themed-button';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export interface SortOption {
  field: string;
  condition: string;
}

export interface SortState {
  [field: string]: string | null;
}

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSorts: SortState;
  onSortsApply: (sorts: SortState) => void;
  sortOptions: SortOption[];
}

export function SortModal({ visible, onClose, selectedSorts, onSortsApply, sortOptions }: SortModalProps) {
  const [tempSorts, setTempSorts] = useState<SortState>(selectedSorts);

  const handleApply = () => {
    onSortsApply(tempSorts);
    onClose();
  };

  const handleCancel = () => {
    setTempSorts(selectedSorts);
    onClose();
  };

  const handleClear = () => {
    const clearedSorts: SortState = {};
    Object.keys(groupedOptions).forEach(field => {
      clearedSorts[field] = null;
    });
    setTempSorts(clearedSorts);
  };

  const handleOptionSelect = (field: string, condition: string) => {
    setTempSorts(prev => ({
      ...prev,
      [field]: prev[field] === condition ? null : condition,
    }));
  };

  const formatConditionLabel = (field: string, condition: string) => {
    if (condition === 'asc') {
      if (field === 'Deadline') return 'Earliest First';
      if (field === 'Assigned To') return 'A-Z';
      if (field === 'Nudge Count') return 'Low to High';
    } else if (condition === 'desc') {
      if (field === 'Deadline') return 'Latest First';
      if (field === 'Assigned To') return 'Z-A';
      if (field === 'Nudge Count') return 'High to Low';
    }
    return 'Default';
  };

  // Group options by field
  const groupedOptions = sortOptions.reduce((acc, option) => {
    if (!acc[option.field]) {
      acc[option.field] = [];
    }
    acc[option.field].push(option);
    return acc;
  }, {} as Record<string, SortOption[]>);

  useEffect(() => {
    if (visible) {
      setTempSorts(selectedSorts);
    }
  }, [visible, selectedSorts]);

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

          <ThemedText type="H2">Sort Tasks</ThemedText>

          <ThemedButton variant="primary" onPress={handleApply}>
            Apply
          </ThemedButton>
        </ThemedView>
        
        <ScrollView style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClear}
          >
            <ThemedText type="Body2" style={styles.clearText}>
              Clear All Sorts
            </ThemedText>
          </TouchableOpacity>

          {Object.entries(groupedOptions).map(([field, options]) => (
            <ThemedView key={field} style={styles.fieldSection}>
              <ThemedText type="Body1" style={styles.fieldLabel}>
                {field}
              </ThemedText>
              
              <ThemedView style={styles.optionsContainer}>
                {options.map((option) => {
                  const isSelected = tempSorts[field] === option.condition;
                  return (
                    <TouchableOpacity
                      key={`${field}-${option.condition}`}
                      style={styles.optionItem}
                      onPress={() => handleOptionSelect(field, option.condition)}
                    >
                      <ThemedText 
                        type="Body2" 
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedText
                        ]}
                      >
                        {formatConditionLabel(option.field, option.condition)}
                      </ThemedText>
                      {isSelected && (
                        <CheckIcon size={RFValue(20)} color={Colors.light.tint} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ThemedView>
            </ThemedView>
          ))}
        </ScrollView>
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
    padding: RFValue(24),
    paddingBottom: RFValue(12),
    borderBottomWidth: RFValue(1),
    borderBottomColor: Colors.light.cardBorder,
  },
  modalContent: {
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(24),
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginBottom: RFValue(16),
  },
  clearText: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
  fieldSection: {
    marginBottom: RFValue(24),
  },
  fieldLabel: {
    fontWeight: '600',
    marginBottom: RFValue(12),
    color: Colors.light.text,
  },
  optionsContainer: {
    gap: RFValue(8),
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: RFValue(16),
    paddingHorizontal: RFValue(12),
    backgroundColor: Colors.light.card,
    borderColor: Colors.light.cardBorder,
    borderWidth: RFValue(0.5),
    borderRadius: RFValue(8),
  },
  optionText: {
    flex: 1,
  },
  selectedText: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
});
