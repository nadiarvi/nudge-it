import { BellIcon } from '@/components/icons/bell-icon';
import { UserCircleIcon } from '@/components/icons/user-circle-icon';
import { StatusDropdown, TaskStatus } from '@/components/ui/status-dropdown';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedTouchableView } from '@/components/ui/touchable-themed-view';
import { Colors, StatusColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SearchIcon } from '../icons/search-icon';

interface TaskCardProps {
  id?: string;
  title: string;
  deadline: string;
  assignedTo: string;
  status: TaskStatus;
  onStatusChange?: (status: TaskStatus) => void;
  reviewer?: string | null;
}

export function TaskCard({ 
  id,
  title, 
  deadline, 
  assignedTo, 
  status,
  reviewer = null,
  onStatusChange = () => {},
}: TaskCardProps) {
  const router = useRouter();

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
      }
    });
  };

  return (
    <ThemedTouchableView style={styles.taskCard} onPress={handlePress}>
      <ThemedView style={styles.leftSection}>
        <ThemedText type="H3">{title}</ThemedText>
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
        <BellIcon size={20} color={Colors.light.blackSecondary} />
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