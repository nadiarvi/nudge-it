import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from '@/components/ui/calendar-icon';
import { SearchIcon } from '@/components/ui/search-icon';
import { StatusDropdown, TaskStatus } from '@/components/ui/status-dropdown';
import { StatusIcon } from '@/components/ui/status-icon';
import { UserCircleIcon } from '@/components/ui/user-circle-icon';
import { Colors } from '@/constants/theme';
import { ReactElement } from 'react';
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

const statusComponent = (status: TaskStatus) => {
    return (
        <StatusDropdown value={status} onValueChange={(newStatus) => {
            console.log('Status changed to:', newStatus);
            // Handle status change here
        }} />
    )
}

export default function TaskDetailPage() {
  return (
    <ParallaxScrollView paddingTop={0}>
        <ThemedView style={styles.taskDetails}>
            <ThemedText type='H1'>Design the Chatbox</ThemedText>
            {taskDetailItem(<CalendarIcon size={14}/>, 'Deadline', '2024-09-30')}
            {taskDetailItem(<UserCircleIcon size={14}/>, 'Assigned To', 'Alice')}
            {taskDetailItem(<StatusIcon size={14}/>, 'Status', statusComponent('In Review' as TaskStatus))}
            {taskDetailItem(<SearchIcon size={14}/>, 'Reviewer', 'Bob')}
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
        paddingVertical: 16,
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