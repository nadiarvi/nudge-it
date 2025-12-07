import { CalendarIcon, SearchIcon, StatusIcon, UserCircleIcon } from '@/components/icons';
import { MemberDropdown, ParallaxScrollView, StatusDropdown, TaskDetailHeader, ThemedButton, ThemedText, ThemedView } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import { useNudgeAlert } from '@/contexts/nudge-context';
import { TaskStatus } from '@/types/task';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, TextInput, View } from 'react-native';

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

interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface TaskDetail {
    id: string;
    assignee: string[];
    comments: User[];
    deadline: Date;
    group_id: string;
    nudges: [];
    reviewer?: string[];
    status: TaskStatus;
    title: string;
}

const TitleInput = ({ 
    value, 
    onChangeText, 
    placeholder, 
    autoFocus, 
    onBlur 
}: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    autoFocus: boolean;
    onBlur: () => void;
}) => {
    return (
        <TextInput
            style={styles.titleInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={Colors.light.blackSecondary}
            autoFocus={autoFocus}
            onBlur={onBlur}
            multiline={false}
        />
    )
}

export default function TaskDetailPage() {
    const navigation = useNavigation();
    const { uid, groups } = useAuthStore();
    const { tid } = useLocalSearchParams();
    const gid = groups[0];
    
    // Determine if this is a new task or existing task
    const isNewTask = !tid || tid === 'new';
    
    const [taskDetail, setTaskDetail] = useState<TaskDetail | undefined>(undefined); 
    const [members, setMembers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(!isNewTask);
    const [isSelf, setIsSelf] = useState(false);

    // Form fields
    const [taskTitle, setTaskTitle] = useState<string>('');
    const [currentStatus, setCurrentStatus] = useState<TaskStatus>('To-Do');
    const [currentAssignedTo, setCurrentAssignedTo] = useState<string>('');
    const [currentReviewer, setCurrentReviewer] = useState<string>('');
    const [currentDeadline, setCurrentDeadline] = useState<Date>(new Date());
    const [allowNudge, setAllowNudge] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    useEffect(() => {
        console.log('current user id:', uid);
        console.log('current assigned to:', currentAssignedTo._id);
        if (uid && currentAssignedTo._id) {
            setIsSelf(uid === currentAssignedTo._id);
        }
    }, [uid, currentAssignedTo]);
    
    const { showNudgeAlert } = useNudgeAlert();
    const router = useRouter();

    const fetchGroupMemberIDs = async () => {
        try {
            const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/groups/${gid}/members`)
            setMembers(res.data.members);
        } catch (error) {
            console.log('Error fetching members:', error);
        }
    };

    const getTaskDetails = async (taskId: string) => {
        if (!taskId || taskId === 'new') return;
        
        setIsLoading(true);
        try {
            const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/tasks/${gid}/${taskId}`);
            setTaskDetail(res.data);
        } catch (error) {
            console.error('Error fetching task details:', error);
            Alert.alert('Error', 'Failed to load task details');
        } finally {
            setIsLoading(false);
        }
    };

    const createNewTask = async () => {
        if (!taskTitle.trim()) {
            Alert.alert('Error', 'Please enter a task title');
            return;
        }

        if (!currentAssignedTo) {
            Alert.alert('Error', 'Please assign the task to someone');
            return;
        }

        const payload = {
            title: taskTitle,
            status: currentStatus,
            assignee: currentAssignedTo._id,
            reviewer: currentReviewer ? currentReviewer._id : [],
            deadline: currentDeadline.toISOString(),
            group_id: gid,
        };

        try {
            const res = await axios.post(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/tasks/create`,
                payload
            );
            router.back();
        } catch (error) {
            console.error('Error creating task:', error);
            Alert.alert('Error', 'Failed to create task');
        }
    };

    const updateTask = async () => {
        if (!taskDetail || !gid || !tid || isNewTask) return;
        if (!taskTitle.trim()) return;

        const hasChanges = 
            currentStatus !== taskDetail.status ||
            taskTitle !== taskDetail.title ||
            currentAssignedTo !== taskDetail.assignee[0] ||
            currentReviewer !== (taskDetail.reviewer?.[0] || '') ||
            currentDeadline.getTime() !== new Date(taskDetail.deadline).getTime();

        if (!hasChanges) return;

        const payload = {
            title: taskTitle,
            status: currentStatus,
            assignee: [currentAssignedTo],
            reviewer: currentReviewer ? [currentReviewer] : [],
            deadline: currentDeadline.toISOString(),
        };

        try {
            const res = await axios.patch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/tasks/${gid}/${tid}`,
                payload
            );
            console.log('Task updated successfully:', res.data.task);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    useEffect(() => {
        if (!isNewTask && taskDetail) {
            return () => {
                updateTask();
            };
        }
    }, [currentStatus, currentAssignedTo, currentReviewer, currentDeadline, taskTitle, taskDetail]);

    useEffect(() => {
        fetchGroupMemberIDs();
        if (!isNewTask) {
            getTaskDetails(tid as string);
        }
    }, [uid, tid]);

    useEffect(() => {
        if (taskDetail) {
            setTaskTitle(taskDetail.title);
            setCurrentStatus(taskDetail.status);
            setCurrentAssignedTo(taskDetail.assignee[0] || '');
            setCurrentReviewer(taskDetail.reviewer?.[0] || '');
            
            if (taskDetail.deadline) {
                setCurrentDeadline(new Date(taskDetail.deadline));
            }

            const isAssignedToCurrentUser = uid === taskDetail.assignee[0];
            setAllowNudge(!isAssignedToCurrentUser);
        } else if (isNewTask) {
            // Set defaults for new task
            setTaskTitle('');
            setCurrentStatus('To-Do');
            setCurrentAssignedTo('');
            setCurrentReviewer('');
            setCurrentDeadline(new Date());
            setAllowNudge(false);
        }
    }, [taskDetail, uid, isNewTask]);

    // Update header for existing tasks
    useLayoutEffect(() => {
        if (!isNewTask && tid) {
            navigation.setOptions({
                headerRight: () => <TaskDetailHeader tid={tid as string} gid={gid} />,
            });
        } else {
            navigation.setOptions({
                headerRight: () => null,
            });
        }
    }, [navigation, tid, gid, isNewTask]);

    // Loading state for existing tasks
    if (isLoading) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText type='H2'>Loading Task Details...</ThemedText>
            </ThemedView>
        );
    }

    const statusComponent = (taskStatus: TaskStatus) => {
        return (
            <StatusDropdown 
                value={taskStatus} 
                onValueChange={setCurrentStatus}
            />
        )
    }

    const memberDropdownComponent = (
        memberList: User[], 
        currentMember: string, 
        onMemberChange: (member: string) => void, 
        placeholder: string
    ) => {
        return (
            <MemberDropdown 
                value={currentMember} 
                members={memberList}
                onValueChange={onMemberChange}
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
        const taskNudgeCount = taskDetail?.nudges?.length || 0;

        showNudgeAlert(
            tid as string,
            taskTitle,
            currentAssignedTo,
            assigneeName,
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

        // DEBUG
        console.log(`Passing param to chat-member: `);
        console.log(currentAssignedTo);

        // const targetUid = currentAssignedTo._id;

        router.push({
            pathname: '/chat-member',
            params: {
                targetUid: currentAssignedTo._id,
                targetUsername: currentAssignedTo.first_name,
            }
        });
    }

    const handleSaveNewTask = () => {
        createNewTask();
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
                <TitleInput 
                    value={taskTitle}
                    onChangeText={setTaskTitle}
                    placeholder="Task Title"
                    autoFocus={isNewTask}
                    onBlur={() => setIsEditingTitle(false)}
                />
                
                {taskDetailItem(<CalendarIcon size={20}/>, 'Deadline', <DatePicker />)}
                {taskDetailItem(
                    <UserCircleIcon size={20}/>, 
                    'Assigned To', 
                    memberDropdownComponent(members, currentAssignedTo, setCurrentAssignedTo, 'Select Member')
                )}
                {taskDetailItem(<StatusIcon size={20}/>, 'Status', statusComponent(currentStatus))}
                {taskDetailItem(
                    <SearchIcon size={20}/>, 
                    'Reviewer', 
                    memberDropdownComponent(members, currentReviewer, setCurrentReviewer, 'Select Reviewer')
                )}
            </ThemedView>

            <ThemedView style={styles.separator} />

            {isNewTask ? (
            // CASE 1 — Creating a new task
            <View style={styles.buttonSection}>
                <ThemedButton variant='primary' onPress={handleSaveNewTask}>
                    Create Task
                </ThemedButton>
                <ThemedButton variant='secondary' onPress={() => router.back()}>
                    Cancel
                </ThemedButton>
            </View>
            ) : !isSelf ? (
            // CASE 2 — Not new task AND not self → show Nudge & Chat
            <View style={styles.buttonSection}>
                <ThemedButton variant='hover' onPress={handleNudgePress}>
                    Nudge
                </ThemedButton>
                <ThemedButton variant='hover' onPress={handleChatPress}>
                    Chat
                </ThemedButton>
            </View>
            ) : null}  // CASE 3 — not new task AND isSelf → show nothing

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
    separator: {
        height: 1,
        backgroundColor: Colors.light.cardBorder,
    },
    titleInput: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.light.text,
        borderWidth: 0,
        borderRadius: 8,
        minHeight: 48,
        letterSpacing: 0,
        fontFamily: Platform.select({
            ios: 'System',
            android: 'sans-serif',
        }),
    },
    editableTitle: {
        marginBottom: 16,
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'transparent',
        minHeight: 48,
    },
});