import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemeTouchableView } from '@/components/touchable-themed-view';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from '@/components/ui/calendar-icon';
import { SearchIcon } from '@/components/ui/search-icon';
import { StatusIcon } from '@/components/ui/status-icon';
import { UserCircleIcon } from '@/components/ui/user-circle-icon';
import { Colors } from '@/constants/theme';
import { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

const taskDetailItem = (icon: ReactElement, name: string, content: string) => {
    return (
        <ThemedView style={styles.taskDetailItem}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4, width: '30%'}}>
                <ThemedText type='Body2'>{icon}</ThemedText>
                <ThemedText type='Body2'>{name}</ThemedText>
            </View>
            <ThemedText type='Body2'>{content}</ThemedText>
        </ThemedView>
    )
}

export default function TaskDetailPage() {
  return (
    <ParallaxScrollView paddingTop={0}>
        <ThemedView style={styles.taskDetails}>
            <ThemedText type='H1'>Design the Chatbox</ThemedText>
            {taskDetailItem(<CalendarIcon size={14}/>, 'Deadline', '2024-09-30')}
            {taskDetailItem(<UserCircleIcon size={14}/>, 'Assigned To', 'Alice')}
            {taskDetailItem(<StatusIcon size={14}/>, 'Status', 'In Progress')}
            {taskDetailItem(<SearchIcon size={14}/>, 'Reviewer', 'Bob')}
        </ThemedView>

        <ThemedView style={styles.buttonSection}>
            <Button onPress={() => console.log('Nudge pressed')}>
                Nudge
            </Button>
            <Button onPress={() => console.log('Chat pressed')}>
                Chat
            </Button>
        </ThemedView>

        <ThemedView style={styles.commentSection}>
            <ThemedText type='Body2'>Comments</ThemedText>

            <ThemeTouchableView style={styles.newCommentSection} onPress={() => console.log('Add comment pressed')}>
                <UserCircleIcon variant='solid' size={14} color={Colors.light.tint}/>
                <ThemedText style={styles.commentPlaceholder} type="Body2">
                    Add a comment...
                </ThemedText>
            </ThemeTouchableView>

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
       gap: 4,
       alignItems: 'center',
    },
    commentPlaceholder: {
        color: Colors.light.blackSecondary,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.light.cardBorder,
    }
});