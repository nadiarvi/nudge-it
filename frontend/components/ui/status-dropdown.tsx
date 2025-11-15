import { Colors, StatusColors } from '@/constants/theme';
import React, { useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TaskStatus = 'To Do' | 'In Review' | 'Revise' | 'Done';

interface StatusDropdownProps {
  value: TaskStatus;
  onValueChange: (status: TaskStatus) => void;
  options?: TaskStatus[];
}

const defaultOptions: TaskStatus[] = ['To Do', 'In Review', 'Revise', 'Done'];

const statusColorMap = {
  'To Do': StatusColors.toDo,
  'In Review': StatusColors.inReview,
  'Revise': StatusColors.revise,
  'Done': StatusColors.done,
};

const statusLightColorMap = {
  'To Do': StatusColors.toDoLight,
  'In Review': StatusColors.inReviewLight,
  'Revise': StatusColors.reviseLight,
  'Done': StatusColors.doneLight,
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

  const getBackgroundColor = (status: TaskStatus) => {
    return statusLightColorMap[status] || StatusColors.toDoLight;
  };

  const getStatusColor = (status: TaskStatus) => {
    return statusColorMap[status] || StatusColors.toDo;
  }

  return (
    <View>
      <TouchableOpacity 
        ref={dropdownRef}
        style={[styles.dropdown, { backgroundColor: getBackgroundColor(value), borderColor: getStatusColor(value), borderWidth: 1 }]}
        onPress={openDropdown}
      >
        <Text style={[styles.dropdownText, { color: getStatusColor(value) }]}>{value}</Text>
        <Text style={[styles.arrow, { color: getStatusColor(value) }]}>▼</Text>
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
          activeOpacity={1}
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
            {options.map((option, index) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  index === options.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => handleSelect(option)}
              >
                <Text style={[styles.optionText, { color: getStatusColor(option) }]}>{option}</Text>
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
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    minWidth: 120,
    borderColor: '#9CA3AF',
    borderWidth: 0.5,
    elevation: 5,
  },
  option: {
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderColor: '#9CA3AF',
    marginVertical: 2,
  },
  optionText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});