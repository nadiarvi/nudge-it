import { ParallaxScrollView, ThemedButton, ThemedText, ThemedTextInput, ThemedTouchableView, ThemedView } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { formatDisplayName } from '@/utils/name-formatter';

interface ProfileSectionProps {
  children: React.ReactNode;
  sectionTitle?: string;
}
interface FieldItemProps {
  label: string;
  value: string;
  style?: object;
  onPress?: () => void;
}
interface ActionItemProps {
  label: string;
  labelStyle?: object;
  icon?: React.ReactNode;
  onPress: () => void;
  style?: object;
}

const ProfileSection = ({ children, sectionTitle }: ProfileSectionProps) => {
  return (
    <ThemedView style={styles.profileSectionContainer}>
      {sectionTitle && <ThemedText type="H2">{sectionTitle}</ThemedText>}
      <ThemedView style={styles.profileSectionItemContainer}>
        {children}
      </ThemedView>
    </ThemedView>
  )
}

const FieldItem = ({ label, value, style, onPress }: FieldItemProps) => {
  const formattedFields = ['First Name', 'Last Name']
  const displayedValue = formattedFields.includes(label) ? formatDisplayName(value) : value;

  return (
    <TouchableOpacity style={[styles.fieldItem, style]} onPress={onPress}>
      <ThemedText type="Body2" style={{ color: Colors.light.blackSecondary }}>{label}</ThemedText>
      <ThemedText type="Body2">{displayedValue}</ThemedText>
    </TouchableOpacity>
  )
}

const ActionItem = ({ label, labelStyle, icon, onPress, style }: ActionItemProps) => {
  return (
    <ThemedTouchableView style={[styles.actionItem, style]} onPress={onPress}>
      {icon && icon}
      <ThemedText type="Body2" style={labelStyle}>{label}</ThemedText>
    </ThemedTouchableView>
  );
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  projectName: string;
  taEmail: string;
  nudgeLimit: string;
  inviteCode: string;
}

interface EditingFieldState {
  label: string;
  key: keyof ProfileData;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { uid, signOut, first_name, last_name, email, groups } = useAuthStore();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<EditingFieldState | null>(null);
  const [editValue, setEditValue] = useState('');
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: first_name,
    lastName: last_name,
    email: email,
    projectName: '',
    taEmail: '',
    nudgeLimit: '',
    inviteCode: '',
  });

  const getGroupInfo = async () => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/groups/${groups[0]}`);
      const projectData = res.data;

      setProfileData(prev => ({
        ...prev,
        projectName: projectData.name,
        taEmail: projectData.ta_email,
        nudgeLimit: projectData.nudge_limit.toString(),
        inviteCode: projectData.invite_code,
      }));
    } catch (error) {
      console.error("Failed to fetch group info:", error);
    }
  }

  useEffect(() => {    
    getGroupInfo();
  }, [uid]);

  const handleFieldPress = (label: string, key: keyof ProfileData, currentValue: string, disable: boolean = false) => {
    if (disable) return;
    setEditingField({ label, key });
    setEditValue(currentValue);
    setIsModalVisible(true);
  };

  const handleCopyToClipboard = async () => {
  if (profileData.inviteCode) {
    try {
      await Clipboard.setStringAsync(profileData.inviteCode);
      Alert.alert('Invite Code Copied', 'The invite code has been copied to your clipboard.');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
};

  const handleSave = () => {
    if (editingField) {
      setProfileData(prev => ({
        ...prev,
        [editingField.key]: editValue
      }));
    }
    setIsModalVisible(false);
    setEditingField(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingField(null);
    setEditValue('');
  };
  
  const handleConfirmLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogOut = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: handleConfirmLogout,
        },
      ]
    );
  };

  const handleSwitchProject = () => {
    console.log("Switch Project pressed - implementing project switch logic...");
  };

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1">Profile</ThemedText>
      </ThemedView>

      <ProfileSection sectionTitle="Account Info">
        <FieldItem 
          label="First Name" 
          value={profileData.firstName} 
          onPress={() => handleFieldPress('First Name', 'firstName', profileData.firstName)}
        />
        <FieldItem 
          label="Last Name" 
          value={profileData.lastName} 
          onPress={() => handleFieldPress('Last Name', 'lastName', profileData.lastName)}
        />
        <FieldItem 
          label="Email" 
          value={profileData.email}
          onPress={() => handleFieldPress('Email', 'email', profileData.email)}
          style={{ borderBottomWidth: 0}}
        />
      </ProfileSection>

      <ProfileSection sectionTitle="Group Project Info">
        <FieldItem 
          label="Project Name" 
          value={profileData.projectName}
          onPress={() => handleFieldPress('Project Name', 'projectName', profileData.projectName)}
        />
        <FieldItem 
          label="TA Email" 
          value={profileData.taEmail}
          onPress={() => handleFieldPress('TA Email', 'taEmail', profileData.taEmail)}
        />
        <FieldItem 
          label="Nudge Limit per Stage" 
          value={profileData.nudgeLimit}
          onPress={() => handleFieldPress('Nudge Limit per Stage', 'nudgeLimit', profileData.nudgeLimit)}
        /> 
        <FieldItem 
          label="Invite Code" 
          value={profileData.inviteCode}
          // onPress={() => handleFieldPress('Invite Code', 'inviteCode', profileData.inviteCode, true)}
          onPress={() => handleCopyToClipboard()}
          style={{ borderBottomWidth: 0}}
        />
      </ProfileSection>

      <ProfileSection sectionTitle="Other">
        {/* <ActionItem 
          label="Switch Project"
          labelStyle = {{ color: Colors.light.text }}
          onPress={handleSwitchProject}
        /> */}
        <ActionItem 
          label="Log Out"
          labelStyle = {{ color: Colors.light.red }}
          onPress={handleLogOut}
          style={{ borderBottomWidth: 0}}
        />
      </ProfileSection>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.modalHeader}>
            <ThemedButton variant="secondary" onPress={handleCancel}>
              Cancel
            </ThemedButton>

            <ThemedText type="H2">{editingField?.label}</ThemedText>

            <ThemedButton variant="primary" onPress={handleSave}>
              Save
            </ThemedButton>
          </ThemedView>
          
          <ThemedView style={styles.modalContent}>
            <ThemedTextInput
              style={styles.textInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editingField?.label}`}
              autoFocus
            />
          </ThemedView>
        </ThemedView>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  profileSectionContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  profileSectionItemContainer: {
    backgroundColor: Colors.light.card,
    borderColor: Colors.light.cardBorder,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'column',
    gap: 4,
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 8,
    paddingVertical: 8,
    borderBottomColor: Colors.light.cardBorder,
    borderBottomWidth: 0.5,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    backgroundColor: Colors.light.card,
    borderBottomColor: Colors.light.cardBorder,
    borderBottomWidth: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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
  textInput: {
    borderWidth: 0.5,
    borderColor: Colors.light.cardBorder,
    borderRadius: 8,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 18,
  },
});
