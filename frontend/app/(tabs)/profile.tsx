import { LogoutIcon } from '@/components/icons/logout-icon';
import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedTouchableView } from '@/components/ui/touchable-themed-view';
import { Colors } from '@/constants/theme';
import { Alert, StyleSheet, View } from 'react-native';
interface ProfileSectionProps {
  children: React.ReactNode;
  sectionTitle?: string;
}
interface FieldItemProps {
  label: string;
  value: string;
  style?: object;
}
interface ActionItemProps {
  label: string;
  labelStyle?: object;
  icon: React.ReactNode;
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

const FieldItem = ({ label, value, style }: FieldItemProps) => {
  return (
    <View style={[styles.fieldItem, style]}>
      <ThemedText type="Body2" style={{ color: Colors.light.blackSecondary }}>{label}</ThemedText>
      <ThemedText type="Body2">{value}</ThemedText>
    </View>
  )
}

const ActionItem = ({ label, labelStyle, icon, onPress, style }: ActionItemProps) => {
  return (
    <ThemedTouchableView style={[styles.actionItem, style]} onPress={onPress}>
      {icon}
      <ThemedText type="Body1" style={labelStyle}>{label}</ThemedText>
    </ThemedTouchableView>
  );
}

export default function ProfileScreen() {
  const handleConfirmLogout = () => {
    console.log("User confirmed logout - implementing logout logic...");
    // TODO: Implement actual logout logic here
    // Example: clear user session, navigate to login screen, etc.
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

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1">Profile</ThemedText>
      </ThemedView>

      <ProfileSection sectionTitle="Account Details">
        <FieldItem label="Username" value="john_doe" />
        <FieldItem label="Email" value="john_doe@example.com" style={{ borderBottomWidth: 0}}/>
      </ProfileSection>

      <ProfileSection>
        <ActionItem 
          label="Log Out"
          labelStyle = {{ color: Colors.light.red }}
          icon={<LogoutIcon size={20} color={Colors.light.red} strokeWidth={2} />}
          onPress={handleLogOut}
          style={{ borderBottomWidth: 0}}
        />
      </ProfileSection>
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
});
