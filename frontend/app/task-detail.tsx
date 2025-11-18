import { CalendarIcon } from '@/components/icons/calendar-icon';
import { SearchIcon } from '@/components/icons/search-icon';
import { StatusIcon } from '@/components/icons/status-icon';
import { UserCircleIcon } from '@/components/icons/user-circle-icon';
import { MemberDropdown } from '@/components/ui/member-dropdown';
import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { StatusDropdown } from '@/components/ui/status-dropdown';
import { ThemedButton } from '@/components/ui/themed-button';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedTextInput } from '@/components/ui/themed-text-input';
import { ThemedView } from '@/components/ui/themed-view';
import { MEMBER_LISTS, SAMPLE_COMMENTS } from '@/constants/dataPlaceholder';
import { Colors } from '@/constants/theme';
import { TaskStatus } from '@/types/task';
import { useLocalSearchParams } from 'expo-router';
import { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const formatTimestamp = (timestamp: string) => {
    //  return is MM.DD HH:MM
    const date = new Date(timestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}.${day}`;
};

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

const commentItem = (comment: {id: string, user: string, text: string, timestamp: string}) => {
    return (
        <ThemedView key={comment.id} style={styles.commentItem}>
            <ThemedText type='Body2' style={styles.commentUser}>
                {comment.user}
            </ThemedText>
            <ThemedText type='Body2' style={styles.commentText}>
                {comment.text}
            </ThemedText>
            <ThemedText type='Body3' style={{color: Colors.light.blackSecondary}}>
                {formatTimestamp(comment.timestamp)}
            </ThemedText>
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
  
  // State management for assigned member and reviewer
  const [currentAssignedTo, setCurrentAssignedTo] = useState<string>(assignedTo as string || '');
  const [currentReviewer, setCurrentReviewer] = useState<string>((reviewer && reviewer !== '') ? reviewer as string : '');
  const [comments, setComments] = useState(SAMPLE_COMMENTS);

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

  const memberDropdownComponent = (memberList: string[], currentMember: string, onMemberChange: (member: string) => void, placeholder: string) => {
    return (
        <MemberDropdown 
          value={currentMember} 
          members={memberList}
          onValueChange={(newMember) => {
            console.log('Member changed to:', newMember);
            onMemberChange(newMember);
            // Handle member change here - you can add API calls or other logic
        }} 
        placeholder={placeholder}
        />
    )
  }
  
  return (
    <ParallaxScrollView paddingTop={0}>
        <ThemedView style={styles.taskDetails}>
            <ThemedText type='H1'>{title as string || 'Task Details'}</ThemedText>
            {taskDetailItem(<CalendarIcon size={20}/>, 'Deadline', deadline as string || 'No deadline set')} 
            {taskDetailItem(<UserCircleIcon size={20}/>, 'Assigned To', memberDropdownComponent(MEMBER_LISTS, currentAssignedTo, setCurrentAssignedTo, 'Select Member'))}
            {taskDetailItem(<StatusIcon size={20}/>, 'Status', statusComponent(currentStatus))}
            {taskDetailItem(<SearchIcon size={20}/>, 'Reviewer', memberDropdownComponent(MEMBER_LISTS, currentReviewer, setCurrentReviewer, 'Select Reviewer'))}
        </ThemedView>

        <ThemedView style={styles.buttonSection}>
            <ThemedButton variant='hover' onPress={() => console.log('Nudge pressed')}>
                Nudge
            </ThemedButton>
            <ThemedButton variant='hover' onPress={() => console.log('Chat pressed')}>
                Chat
            </ThemedButton>
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

            {/* Existing comments section */}
            <ThemedView>
                {comments && comments.length > 0 ? (
                    comments.map((comment) => commentItem(comment))
                ) : (
                    <ThemedText type='Body2' style={{color: Colors.light.blackSecondary}}>
                        No comments yet.
                    </ThemedText>
                )}
            </ThemedView>
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
        gap: 32,
        marginTop: 14,
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
    },
    commentItem: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    commentUser: {
        minWidth: 48,
        fontWeight: '600',
        color: Colors.light.tint,
    },
    commentText: {
        flex: 1,
        color: Colors.light.text,
    }
});