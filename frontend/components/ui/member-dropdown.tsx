import { Colors } from '@/constants/theme';
import { formatDisplayName } from '@/utils/name-formatter';
import React, { useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ThemedText } from './themed-text';

export type Member = User;

interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface MemberDropdownProps {
  // value is now definitely a Member object or null/undefined
  value: Member | null | undefined; 
  onValueChange: (member: Member) => void;
  members?: Member[];
  placeholder?: string;
}

const defaultMembers: Member[] = [
  { _id: '1', first_name: 'Member1', last_name: 'Last1', email: 'member1@example.com' },
  { _id: '2', first_name: 'Member2', last_name: 'Last2', email: 'member2@example.com' },
  { _id: '3', first_name: 'Member3', last_name: 'Last3', email: 'member3@example.com' }
];

// Helper to display member name
const getMemberDisplayName = (member: Member) => {
    return  formatDisplayName(member.first_name) || 'Unknown Member';
};

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

  const currentMemberDisplayName = value ? getMemberDisplayName(value) : placeholder;

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
            // Check if value exists to determine text color
            color: value ? Colors.light.text : Colors.light.blackSecondary
          }}
        >
          {/* Renders the name of the selected member or the placeholder */}
          {currentMemberDisplayName}
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
                // Use a unique string from the object for the key
                key={member._id} 
                style={[
                  styles.option,
                  index === members.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => handleSelect(member)}
              >
                {/* Render the display name from the object */}
                <Text style={[styles.optionText, { color: Colors.light.text }]}>{getMemberDisplayName(member)}</Text>
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
    fontSize: RFValue(8),
    marginLeft: RFValue(4),
  },
  overlay: {
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: RFValue(0),
    minWidth: RFValue(120),
    borderColor: Colors.light.cardBorder,
    borderWidth: RFValue(0.5),
    elevation: 5,
  },
  option: {
    paddingVertical: RFValue(8),
    borderBottomWidth: RFValue(0.5),
    borderColor: Colors.light.cardBorder,
    marginVertical: RFValue(0),
    minWidth: RFValue(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    color: Colors.light.text,
    fontSize: RFValue(14),
    fontWeight: '500',
    textAlign: 'center',
  },
});