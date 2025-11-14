import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BellIcon } from '@/components/ui/bell-icon';
import { StatusDropdown, TaskStatus } from '@/components/ui/status-dropdown';
import { UserCircleIcon } from '@/components/ui/user-circle-icon';
import { Colors, StatusColors } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';
import { SearchIcon } from './search-icon';

interface TaskCardProps {
  title: string;
  deadline: string;
  assignedTo: string;
  status: TaskStatus;
  onStatusChange?: (status: TaskStatus) => void;
  reviewer?: string | null;
}

export function TaskCard({ 
  title, 
  deadline, 
  assignedTo, 
  status,
  reviewer = null,
  onStatusChange = () => {},
}: TaskCardProps) {
  return (
    <ThemedView style={styles.taskCard}>
      <ThemedView style={styles.leftSection}>
        <ThemedText type="Body1">{title}</ThemedText>
        <ThemedText type="Body3" style={{color: Colors.light.blackSecondary}}>{deadline}</ThemedText>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
          <UserCircleIcon size={12} color={Colors.light.tint} />
          <ThemedText type="Body3" style={{color: Colors.light.tint}}>{assignedTo}</ThemedText>
          {reviewer && (
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
        <BellIcon size={16} color={Colors.light.blackSecondary} />
        <StatusDropdown 
          value={status}
          onValueChange={onStatusChange}
        />
      </ThemedView>
    </ThemedView>
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