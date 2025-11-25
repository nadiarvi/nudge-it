import { CalendarIcon, SearchIcon, StatusIcon, UserCircleIcon } from '@/components/icons';
import { MemberDropdown, ParallaxScrollView, StatusDropdown, ThemedButton, ThemedText, ThemedView } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import { useNudgeAlert } from '@/contexts/nudge-context';
import { TaskStatus } from '@/types/task';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ReactElement, useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';

const formatTimestamp = (timestamp: Date) => {
    //  return is MM.DD HH:MM
    const month = (timestamp.getMonth() + 1).toString().padStart(2, '0');
    const day = timestamp.getDate().toString().padStart(2, '0');
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
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

const commentItem = (comment: {id: string, user: string, text: string, timestamp: Date}) => {
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

interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface TaskDetail {
    id: string;
    assignedTo: [];
    comments: User[];
    deadline: Date;
    group_id: string;
    nudges: [];
    reviewer?: User[];
    status: TaskStatus;
    title: string;
}

export default function TaskDetailPage() {
    const { uid, groups } = useAuthStore();
    const { tid } = useLocalSearchParams();
    ////console.log(`TaskDetailPage params - tid: ${tid}, uid: ${uid}, groups: ${groups}`);
    const gid = groups[0];
    
    const [taskDetail, setTaskDetail] = useState<TaskDetail | undefined>(undefined); 
    const [members, setMembers] = useState<User[]>([]);

    const [currentStatus, setCurrentStatus] = useState<TaskStatus>('To-Do');
    const [currentAssignedTo, setCurrentAssignedTo] = useState<string>(''); // Will hold the assignee ID
    const [currentReviewer, setCurrentReviewer] = useState<string>(''); // Will hold the reviewer ID
    const [currentDeadline, setCurrentDeadline] = useState<Date>(new Date());
    const [allowNudge, setAllowNudge ] = useState(false);

    const { showNudgeAlert } = useNudgeAlert();
    const router = useRouter();


    const fetchGroupMemberIDs = async () => {
        try {
            const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/groups/${groups[0]}/members`)
            ////console.log('Fetched group members:', res.data.members);
            setMembers(res.data.members);
        } catch (error) {
            ////console.log('Error: ', error);
        }
    };

    const getTaskDetails = async (taskId: string) => {
        try {
            const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/tasks/${gid}/${taskId}`);
            ////console.log('Fetched task details:', res.data);
            setTaskDetail(res.data);
        } catch (error) {
            ////console.log('Error fetching task details:', error);
            console.error(`failed req: ${process.env.EXPO_PUBLIC_API_BASE_URL}/api/tasks/${gid}/${taskId}`);
            setTaskDetail(null);
        }
    };

    useEffect(() => {
        fetchGroupMemberIDs();
        getTaskDetails(tid as string);
    }, [uid, tid]);

    useEffect(() => {
        if (taskDetail) {
            setCurrentStatus(taskDetail.status || 'To-Do');

            const assignedId = taskDetail.assignee[0];
            //////console.log('Setting currentAssignedTo to:', assignedId);
            setCurrentAssignedTo(assignedId);
            
            const reviewerId = taskDetail.reviewer[0];
            //////console.log('Setting currentReviewer to:', reviewerId);
            setCurrentReviewer(reviewerId);

            if (taskDetail.deadline) {
                setCurrentDeadline(new Date(taskDetail.deadline));
            }

            const show = uid === assignedId;
            setAllowNudge(!show);
        }
    }, [taskDetail, uid]);

//   const initialStatus = taskDetail.status;
//   const [currentStatus, setCurrentStatus] = useState<TaskStatus>(initialStatus);
  
//   // State management for assigned member and reviewer
//   const [currentAssignedTo, setCurrentAssignedTo] = useState(taskDetail.assignedTo);
//   const [currentReviewer, setCurrentReviewer] = useState(taskDetail.reviewer ?? taskDetail.reviewer);
//   const [comments, setComments] = useState([]);


//   const [ allowNudge, setAllowNudge ] = useState(false);

//   const [modalCalendar, setModalCalendar] = useState(false);
//   const [currentDeadline, setCurrentDeadline] = useState(new Date(taskDetail.deadline));

//   useEffect(() => {
//     const show = uid === taskDetail.assignedTo;
//     setAllowNudge(!show);
//   }, [uid, taskDetail]);
  
  
  // Get nudge alert hook and router
//   const { showNudgeAlert } = useNudgeAlert();
//   const router = useRouter();

    // --- Render Guard (Handle loading and error states) ---
    if (taskDetail === undefined) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText type='H2'>Loading Task Details...</ThemedText>
            </ThemedView>
        );
    }
    
    if (taskDetail === null) {
         return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText type='H2' style={{ color: Colors.light.red }}>Task Not Found or Failed to Load</ThemedText>
            </ThemedView>
        );
    }
    // --- End Render Guard ---

    const statusComponent = (taskStatus: TaskStatus) => {
        return (
            <StatusDropdown 
            value={taskStatus} 
            onValueChange={(newStatus) => {
                //////console.log('Status changed to:', newStatus);
                setCurrentStatus(newStatus);
                // Handle status change here - you can add API calls or other logic
            }} />
        )
    }

    const memberDropdownComponent = (memberList: string[], currentMember: string, onMemberChange: (member: string) => void, placeholder: string) => {
        //////console.log('Rendering MemberDropdown with currentMember:', currentMember);
        return (
            <MemberDropdown 
            value={currentMember} 
            members={memberList}
            onValueChange={(newMember) => {
                //////console.log('Member changed to:', newMember);
                onMemberChange(newMember);
                // Handle member change here - you can add API calls or other logic
            }} 
            placeholder={placeholder}
            />
        )
    }

    const handleNudgePress = () => {
        if (!allowNudge) {
        Alert.alert(
            'Nudge Disabled',
            'You cannot nudge a task that you are assigned to',
            [{ text: 'OK' }]
        );
        return;
        }
        const assignee = members.find(m => m._id === currentAssignedTo);
        const assigneeName = assignee ? `${assignee.first_name} ${assignee.last_name}` : 'The Assignee';
        const taskNudgeCount = parseInt(taskDetail.nudges.length as string) || 0;

        //////console.log('Showing nudge alert for task:', taskDetail.title, 'with nudge count:', taskNudgeCount);
        //////console.log(currentAssignedTo);
        // showNudgeAlert(taskDetail, taskDetail.title as string, currentAssignedTo, taskNudgeCount);

        showNudgeAlert(
            tid as string, // Pass tid
            taskDetail.title as string,
            currentAssignedTo, // Pass ID
            assigneeName, // Pass Name
            taskNudgeCount
        );
    }

    const handleChatPress = () => {
        if (!allowNudge) {
        Alert.alert(
            'Chat Disabled',
            'You cannot chat about a task that you are assigned to',
            [{ text: 'OK' }]
        );
        return;
        }
        // router.replace('/chat');
        // console.log(`passing uid: ${uid} and assignee: ${currentAssignedTo._id} to chat-member page`);
        // router.replace(`/chat-member?user=${uid}&assignee=${currentAssignedTo._id}`);
        
        // router.replace({
        //     pathname: '/chat-member',
        //     params: {
        //         assignedTo: currentAssignedTo,
        //     }
        // })

        router.replace({
            pathname: '/chat-member',
            params: {
                // 🔑 FIX: Pass only the string ID and use a consistent name (targetUserId)
                targetUserId: currentAssignedTo._id, 
            }
        });
    }

    const DatePicker = () => {
        return (
            <DateTimePicker
                mode="date"
                display="compact"
                value={currentDeadline}
                onChange={(event, selectedDate) => {
                    if (selectedDate) {
                        setCurrentDeadline(selectedDate);
                        ////console.log('Deadline changed to:', selectedDate);
                    }
                }}
                style={{
                    marginLeft: Platform.OS === "ios" ? -16 : 0,
                }}
            />
        )
    }
    
    return (
        <ParallaxScrollView paddingTop={0}>
            <ThemedView style={styles.taskDetails}>
                <ThemedText type='H1'>{taskDetail.title as string || 'Task Details'}</ThemedText>
                {taskDetailItem(<CalendarIcon size={20}/>, 'Deadline', <DatePicker />)}
                {taskDetailItem(<UserCircleIcon size={20}/>, 'Assigned To', memberDropdownComponent(members, currentAssignedTo, setCurrentAssignedTo, 'Select Member'))}
                {taskDetailItem(<StatusIcon size={20}/>, 'Status', statusComponent(currentStatus))}
                {taskDetailItem(<SearchIcon size={20}/>, 'Reviewer', memberDropdownComponent(members, currentReviewer, setCurrentReviewer, 'Select Reviewer'))}
            </ThemedView>

            <ThemedView style={styles.separator} />

            <ThemedView style={styles.buttonSection}>
                <ThemedButton variant='hover' onPress={handleNudgePress}>
                    Nudge
                </ThemedButton>
                <ThemedButton variant='hover' onPress={handleChatPress}>
                    Chat
                </ThemedButton>
            </ThemedView>

            {/* <ThemedView style={styles.commentSection}>
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

                <ThemedView>
                    {comments && comments.length > 0 ? (
                        comments.map((comment) => commentItem(comment))
                    ) : (
                        <ThemedText type='Body2' style={{color: Colors.light.blackSecondary}}>
                            No comments yet.
                        </ThemedText>
                    )}
                </ThemedView>
            </ThemedView> */}
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
        gap: 36,
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
    },
    datePickerContainer: {
        // marginHorizontal: -22,
        backgroundColor: Colors.light.background,
    }
});