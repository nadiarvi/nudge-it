import { Colors } from '@/constants/theme';
import React, { useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';

export type Member = string;

interface MemberDropdownProps {
  value: Member;
  onValueChange: (member: Member) => void;
  members?: Member[];
  placeholder?: string;
}

const defaultMembers: Member[] = ['Member1', 'Member2', 'Member3'];

export function MemberDropdown({ 
  value, 
  onValueChange, 
  members = defaultMembers,
  placeholder = 'Select Member'
}: MemberDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const dropdownRef = useRef<View>(null);

  const handleSelect = (member: Member) => {
    onValueChange(member);
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
        style={styles.dropdown}
        onPress={openDropdown}
      >
        <ThemedText 
          type='Body2'
          style={{
            color: value ? Colors.light.text : Colors.light.blackSecondary
          }}
        >
          {value || placeholder}
        </ThemedText>
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
            {members.map((member, index) => (
              <TouchableOpacity
                key={member}
                style={[
                  styles.option,
                  index === members.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => handleSelect(member)}
              >
                <Text style={[styles.optionText, { color: Colors.light.text }]}>{member}</Text>
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
  },
  arrow: {
    fontSize: 8,
    marginLeft: 4,
  },
  overlay: {
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 0,
    minWidth: 120,
    borderColor: Colors.light.cardBorder,
    borderWidth: 0.5,
    elevation: 5,
  },
  option: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: Colors.light.cardBorder,
    marginVertical: 0,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});