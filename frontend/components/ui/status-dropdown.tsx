import React, { useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TaskStatus = 'To Do' | 'In Review' | 'Revise' | 'Done';

interface StatusDropdownProps {
  value: TaskStatus;
  onValueChange: (status: TaskStatus) => void;
  options?: TaskStatus[];
}

const defaultOptions: TaskStatus[] = ['To Do', 'In Review', 'Revise', 'Done'];

const statusColors = {
  'To Do': '#FF6B6B',
  'In Review': '#FFD93D',
  'Revise': '#A855F7',
  'Done': '#6BCF7F',
};

export function StatusDropdown({ 
  value, 
  onValueChange, 
  options = defaultOptions 
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const dropdownRef = useRef<View>(null);

  const handleSelect = (status: TaskStatus) => {
    onValueChange(status);
    setIsOpen(false);
  };

  const openDropdown = () => {
    dropdownRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
      setDropdownLayout({ x, y, width, height });
      setIsOpen(true);
    });
  };

  return (
    <View>
      <TouchableOpacity 
        ref={dropdownRef}
        style={[styles.dropdown, { backgroundColor: statusColors[value] }]}
        onPress={openDropdown}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
        >
          <View 
            style={[
              styles.optionsContainer,
              {
                position: 'absolute',
                top: dropdownLayout.y + dropdownLayout.height + 4,
                left: dropdownLayout.x,
                minWidth: dropdownLayout.width,
              }
            ]}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.option, { backgroundColor: statusColors[option] }]}
                onPress={() => handleSelect(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 80,
  },
  dropdownText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  arrow: {
    color: 'white',
    fontSize: 8,
    marginLeft: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginVertical: 2,
  },
  optionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});