import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BellIcon } from '@/components/ui/bell-icon';
import { StatusDropdown, TaskStatus } from '@/components/ui/status-dropdown';
import { UserCircleIcon } from '@/components/ui/user-circle-icon';
import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

interface TaskCardProps {
  title: string;
  deadline: string;
  assignedTo: string;
  status: TaskStatus;
  onStatusChange?: (status: TaskStatus) => void;
}

export function TaskCard({ 
  title, 
  deadline, 
  assignedTo, 
  status,
  onStatusChange = () => {},
}: TaskCardProps) {
  return (
    <ThemedView style={styles.taskCard}>
      <ThemedView style={styles.leftSection}>
        <ThemedText type="Body1">{title}</ThemedText>
        <ThemedText type="Body3" style={{color: Colors.light.blackSecondary}}>{deadline}</ThemedText>
        <ThemedView style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
          <UserCircleIcon size={12} color={Colors.light.tint} />
          <ThemedText type="Body3" style={{color: Colors.light.tint}}>{assignedTo}</ThemedText>
        </ThemedView>
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