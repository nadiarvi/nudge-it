import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { ThemedButton } from '@/components/ui/themed-button';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedTextInput } from '@/components/ui/themed-text-input';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedTouchableView } from '@/components/ui/touchable-themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, TouchableOpacity } from 'react-native';
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
  return (
    <TouchableOpacity style={[styles.fieldItem, style]} onPress={onPress}>
      <ThemedText type="Body2" style={{ color: Colors.light.blackSecondary }}>{label}</ThemedText>
      <ThemedText type="Body2">{value}</ThemedText>
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
  username: string;
  email: string;
  projectName: string;
  nudgeLimit: string;
}

interface EditingFieldState {
  label: string;
  key: keyof ProfileData;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<EditingFieldState | null>(null);
  const [editValue, setEditValue] = useState('');
  const [profileData, setProfileData] = useState<ProfileData>({
    username: user?.firstName && user?.lastName ? `${user.firstName}_${user.lastName}`.toLowerCase() : 'user',
    email: user?.email || 'user@example.com',
    projectName: 'CS473 Social Computing',
    nudgeLimit: '1',
  });

  const handleFieldPress = (label: string, key: keyof ProfileData, currentValue: string) => {
    setEditingField({ label, key });
    setEditValue(currentValue);
    setIsModalVisible(true);
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
      await logout();
      console.log("User logged out");
      // Navigate to login screen and reset navigation stack
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
          label="Username" 
          value={profileData.username} 
          onPress={() => handleFieldPress('Username', 'username', profileData.username)}
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
          label="Nudge Limit per Stage" 
          value={profileData.nudgeLimit}
          onPress={() => handleFieldPress('Nudge Limit per Stage', 'nudgeLimit', profileData.nudgeLimit)}
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
