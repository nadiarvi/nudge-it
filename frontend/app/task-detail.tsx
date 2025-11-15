import { CalendarIcon } from '@/components/icons/calendar-icon';
import { SearchIcon } from '@/components/icons/search-icon';
import { StatusIcon } from '@/components/icons/status-icon';
import { UserCircleIcon } from '@/components/icons/user-circle-icon';
import { Button } from '@/components/ui/button';
import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { StatusDropdown, TaskStatus } from '@/components/ui/status-dropdown';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedTextInput } from '@/components/ui/themed-text-input';
import { ThemedView } from '@/components/ui/themed-view';
import { Colors } from '@/constants/theme';
import { useLocalSearchParams } from 'expo-router';
import { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const taskDetailItem = (icon: ReactElement, name: string, content: string | ReactElement) => {
    return (
        <ThemedView style={styles.taskDetailItem}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4, width: '30%'}}>
                <ThemedText type='Body2'>{icon}</ThemedText>
                <ThemedText type='Body2'>{name}</ThemedText>
            </View>
            {typeof content === 'string' ? (
                <ThemedText type='Body2'>{content}</ThemedText>
            ) : (
                content
            )}
        </ThemedView>
    )
}

export default function TaskDetailPage() {
  // Retrieve parameters passed from the calling page
  const params = useLocalSearchParams();
  const {
    id,
    title,
    deadline,
    assignedTo,
    status,
    reviewer
  } = params;

  // Convert status to proper TaskStatus type and manage local state
  const initialStatus = (status as TaskStatus) || 'To Do';
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(initialStatus);

  const statusComponent = (taskStatus: TaskStatus) => {
    return (
        <StatusDropdown 
          value={taskStatus} 
          onValueChange={(newStatus) => {
            console.log('Status changed to:', newStatus);
            setCurrentStatus(newStatus);
            // Handle status change here - you can add API calls or other logic
        }} />
    )
  }
  
  return (
    <ParallaxScrollView paddingTop={0}>
        <ThemedView style={styles.taskDetails}>
            <ThemedText type='H1'>{title as string || 'Task Details'}</ThemedText>
            {taskDetailItem(<CalendarIcon size={14}/>, 'Deadline', deadline as string || 'No deadline set')} 
            {taskDetailItem(<UserCircleIcon size={14}/>, 'Assigned To', assignedTo as string || 'Unassigned')}
            {taskDetailItem(<StatusIcon size={14}/>, 'Status', statusComponent(currentStatus))}
            {taskDetailItem(<SearchIcon size={14}/>, 'Reviewer', (reviewer && reviewer !== '') ? reviewer as string : 'Not Assigned')}
        </ThemedView>

        <ThemedView style={styles.buttonSection}>
            <Button variant='hover' onPress={() => console.log('Nudge pressed')}>
                Nudge
            </Button>
            <Button variant='hover' onPress={() => console.log('Chat pressed')}>
                Chat
            </Button>
        </ThemedView>

        <ThemedView style={styles.commentSection}>
            <ThemedText type='Body2'>Comments</ThemedText>

            <View style={styles.newCommentSection}>
                <UserCircleIcon variant='solid' size={16} color={Colors.light.tint}/>
                <ThemedTextInput 
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    multiline={true}
                    type="Body2"
                />
            </View>

            <ThemedView style={styles.separator} />
        </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
    taskDetails: {
        paddingTop: 16,
    },
    taskDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },
    buttonSection: {
        flexDirection: 'row',
        gap: 12,
        alignSelf: 'center',
    },
    commentSection: {
        flexDirection: 'column',
        gap: 8,
    },
    newCommentSection: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'flex-start',
    },
    commentInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.light.text,
        paddingVertical: 0,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.light.cardBorder,
    }
});