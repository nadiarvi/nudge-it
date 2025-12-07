import { CheckIcon } from '@/components/icons/check-icon';
import { Colors } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ThemedButton } from './themed-button';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export interface FilterOption {
  field: string;
  options: string[];
}

export interface FilterState {
  [key: string]: string | null;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedFilters: FilterState;
  onFiltersApply: (filters: FilterState) => void;
  filterOptions: FilterOption[];
}

export function FilterModal({ visible, onClose, selectedFilters, onFiltersApply, filterOptions }: FilterModalProps) {
  const [tempFilters, setTempFilters] = useState<FilterState>(selectedFilters);

  const handleApply = () => {
    onFiltersApply(tempFilters);
    onClose();
  };

  const handleCancel = () => {
    setTempFilters(selectedFilters);
    onClose();
  };

  const handleClearAll = () => {
    const clearedFilters: FilterState = {};
    filterOptions.forEach(filter => {
      clearedFilters[filter.field] = null;
    });
    setTempFilters(clearedFilters);
  };

  const handleOptionSelect = (field: string, value: string | null) => {
    setTempFilters(prev => ({
      ...prev,
      [field]: prev[field] === value ? null : value,
    }));
  };

  useEffect(() => {
    if (visible) {
      setTempFilters(selectedFilters);
    }
  }, [visible, selectedFilters]);

  const formatFieldLabel = (field: string) => {
    return field
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
        
        <ScrollView style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.clearAllButton}
            onPress={handleClearAll}
          >
            <ThemedText type="Body2" style={styles.clearAllText}>
              Clear All Filters
            </ThemedText>
          </TouchableOpacity>

          {filterOptions.map((filterOption) => (
            <ThemedView key={filterOption.field} style={styles.filterSection}>
              <ThemedText type="Body1" style={styles.filterLabel}>
                {formatFieldLabel(filterOption.field)}
              </ThemedText>
              
              <ThemedView style={styles.optionsContainer}>
                {filterOption.options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.optionItem}
                    onPress={() => handleOptionSelect(filterOption.field, option)}
                  >
                    <ThemedText 
                      type="Body2" 
                      style={[
                        styles.optionText,
                        tempFilters[filterOption.field] === option && styles.selectedText
                      ]}
                    >
                      {option}
                    </ThemedText>
                    {tempFilters[filterOption.field] === option && (
                      <CheckIcon size={RFValue(20)} color={Colors.light.tint} />
                    )}
                  </TouchableOpacity>
                ))}
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
  clearAllButton: {
    alignSelf: 'flex-end',
    marginBottom: RFValue(16),
  },
  clearAllText: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: RFValue(24),
  },
  filterLabel: {
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
