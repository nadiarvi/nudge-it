import { BellIcon } from '@/components/icons/bell-icon';
import { UserCircleIcon } from '@/components/icons/user-circle-icon';
import { StatusDropdown } from '@/components/ui/status-dropdown';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedTouchableView } from '@/components/ui/touchable-themed-view';
import { Colors, StatusColors } from '@/constants/theme';
import { useNudgeAlert } from '@/hooks/use-nudge-alert';
import { TaskCardProps } from '@/types/task';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { FlagIcon } from '../icons/flag-icon';
import { SearchIcon } from '../icons/search-icon';

export function TaskCard({ 
  id,
  title, 
  deadline, 
  assignedTo, 
  status,
  reviewer = null,
  nudgeCount = 0,
  onStatusChange = () => {},
}: TaskCardProps) {
  const router = useRouter();
  const { showNudgeAlert } = useNudgeAlert();

  const handlePress = () => {
    // Navigate to task detail page with parameters
    router.push({
      pathname: '/task-detail',
      params: { 
        id: id || title, // Use id if available, otherwise fallback to title
        title,
        deadline,
        assignedTo,
        status,
        reviewer: reviewer || '',
        nudgeCount: 0,
      }
    });
  };

  const handleNudge = () => {
    showNudgeAlert(title, { option2Enabled: false, option3Enabled: false });
  }

  const MAX_TITLE_LENGTH = 25;

  const truncatedTitle = title.length > MAX_TITLE_LENGTH 
                            ? title.substring(0, MAX_TITLE_LENGTH) + "..." 
                            : title;

  return (
    <ThemedTouchableView style={styles.taskCard} onPress={handlePress}>
      <ThemedView style={styles.leftSection}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <ThemedText type="H3">{nudgeCount > 3 ? title : truncatedTitle}</ThemedText>
          { nudgeCount > 0 && (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <FlagIcon size={18} color={Colors.light.red} strokeWidth={2}/>
              <ThemedText type="Body3" style={{color: Colors.light.red}}>{`${nudgeCount}`}</ThemedText>
              { nudgeCount >= 3 && (
                <ThemedText type="Body3" style={{color: Colors.light.red}}>|TA</ThemedText>
              )}
            </View>
          )}
        </View>
        <ThemedText type="Body3" style={{color: Colors.light.blackSecondary}}>{deadline}</ThemedText>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
          <UserCircleIcon size={12} color={Colors.light.tint} />
          <ThemedText type="Body3" style={{color: Colors.light.tint}}>{assignedTo}</ThemedText>
          { status !== "To Do" && (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <ThemedText type="Body3" style={{color: Colors.light.blackSecondary}}>
                |
              </ThemedText>
              <SearchIcon size={12} color={reviewer === "Not Assigned" ? StatusColors.inReview : Colors.light.blackSecondary} />
              <ThemedText type="Body3" style={{color: reviewer === "Not Assigned" ? StatusColors.inReview : Colors.light.blackSecondary}}>
                {reviewer === "Not Assigned" ? "Not Assigned" : `${reviewer}`}
              </ThemedText>
            </View>
          )}
        </View>
      </ThemedView>
      <ThemedView style={styles.rightSection}>
        <ThemedTouchableView onPress={handleNudge} style={{ marginLeft: 8 }}>
          <BellIcon size={24} color={Colors.light.blackSecondary} />
        </ThemedTouchableView>
        <StatusDropdown 
          value={status}
          onValueChange={onStatusChange}
        />
      </ThemedView>
    </ThemedTouchableView>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 0.3,
    borderColor: Colors.light.cardBorder,
    backgroundColor: Colors.light.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    backgroundColor: Colors.light.card,
    flexDirection: 'column',
    gap: 4,
  },
  rightSection: {
    backgroundColor: Colors.light.card,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  }
});