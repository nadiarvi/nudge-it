import { CheckIcon, ClockIcon, InboxIcon, SendIcon, TodoIcon } from '@/components/icons';
import { ParallaxScrollView, TaskCard, ThemedText, ThemedView } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { ReactElement, useCallback, useRef, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const nudgeCountComponent = (icon: ReactElement, title: string, count: number) => (
  <ThemedView style={styles.nudgeComponent}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: RFValue(4) }}>
      {icon}
      <ThemedText type='Body2' style={{color: Colors.light.blackSecondary, fontWeight: '500'}}>{title}</ThemedText>
    </View>
    <ThemedText type='H1'>{count}</ThemedText>
  </ThemedView>
)

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'To Do':
      return <TodoIcon size={RFValue(22)} color={Colors.light.blackSecondary} />;
    case 'To Review':
      return <CheckIcon size={RFValue(22)} color={Colors.light.blackSecondary} />;
    case 'Pending for Review':
      return <ClockIcon size={RFValue(22)} color={Colors.light.blackSecondary} />;
    default:
      return <TodoIcon size={RFValue(22)} color={Colors.light.blackSecondary} />;
  }
}

const renderTaskSection = (category: string, tasks: any[], handleStatusChange) => (
  <ThemedView key={category} style={styles.todoSectionContainer}>
    <View style={styles.todoHeader}>
      {getCategoryIcon(category)}
      <ThemedText style={{ flex: 1, color: Colors.light.blackSecondary }} type='H2'>{category} ({tasks.length})</ThemedText>
      {/* <ThemedTouchableView>
        <ArrowIcon size={20} color={Colors.light.blackSecondary} />
      </ThemedTouchableView> */}
    </View>
    {tasks.length > 0 ? (
      tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          deadline={task.deadline}
          assignedTo={task.assignee}
          status={task.status}
          reviewer={task.reviewer}
          nudgeCount={task.nudges}
          onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
        />
      ))
    ) : (
      <ThemedView style={styles.noItemContainer}>
        <ThemedText type='Body2' style={{color: Colors.light.blackSecondary}}>
          No items in {category.toLowerCase()}.
        </ThemedText>
      </ThemedView>
    )}
  </ThemedView>
)

const projectDropdownComponent = (projectName: string, onPress: () => void, dropdownRef: React.RefObject<View | null>) => (
  <TouchableOpacity ref={dropdownRef} style={styles.projectDropdown} onPress={onPress} disabled={true}>
    <ThemedText type='Body2' style={{color: Colors.light.blackSecondary}}>{projectName}</ThemedText>
    {/* <DropdownIcon size={12} strokeWidth={3} color={Colors.light.tint} /> */}
  </TouchableOpacity>
)

const projectSelectionModal = (isVisible: boolean, onClose: () => void, onSelectProject: (project: string) => void, currentProject: string, dropdownLayout: {x: number, y: number, width: number, height: number}) => {
  const projects = ['CS473 Social Computing'];
  
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <View 
          style={[
            styles.modalContent,
            dropdownLayout ? {
              position: 'absolute',
              top: dropdownLayout.y + dropdownLayout.height + 4,
              right: 24,
              maxWidth: 320,
            } : {
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: [{ translateX: -160 }, { translateY: -100 }],
              minWidth: 280,
              maxWidth: 320,
            }
          ]}
        >
          {projects.map((project) => (
            <TouchableOpacity
              key={project}
              style={[
                styles.modalOption,
                project === currentProject && styles.selectedOption
              ]}
              onPress={() => {
                onSelectProject(project);
                onClose();
              }}
            >
              <ThemedText 
                type='Body2' 
                style={[
                  styles.modalOptionText
                ]}
              >
                {project}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

interface User {
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  groups: string[];
  
}
interface TaskSection {
  category: string;
  tasks: {
    id: string;
    title: string;
    deadline: Date;
    assignee: [User];
    reviewer?: [User];
    nudges: [];
  }
}

export default function HomeScreen() {
  const { uid, first_name, groups, isLoading } = useAuthStore();

  const currentUser = first_name;
  const gid = groups[0];
  type TaskSection = {
    category: string;
    tasks: any[];
  };
  const [taskList, setTaskList] = useState<TaskSection[]>([]);
  const [prjName, setPrjName] = useState('XXX');
  const [nudgeSent, setNudgeSent] = useState(99);
  const [nudgeReceived, setNudgeReceived] = useState(99);

  const retrieveTasks = async () => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/tasks/${gid}/user/${uid}`);
      setTaskList(res.data.result);
    } catch (error) {
      console.error('Error retrieving tasks:', error);
    }
  }

  const fetchNudgeSent = async () => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/nudges/${gid}/${uid}/sent`);
      setNudgeSent(res.data.totalNudge);
    } catch (error) {
      console.error('Error fetching nudge sent:', error);
    }
  };

  const fetchNudgeReceived = async () => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/nudges/${gid}/${uid}/received`);
      setNudgeReceived(res.data.totalNudge);
    } catch (error) {
      console.error('Error fetching nudge received:', error);
    }
  }

  const fetchProjectName = async () => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/groups/${gid}`);
      //console.log('Fetched project name:', res.data.name);
      setPrjName(res.data.name);
    } catch (error) {
      console.error('Error fetching project name:', error);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTaskList(prev =>
      prev.map(section => ({
        ...section,
        tasks: section.tasks.map(task =>
          task.id === taskId
            ? { ...task, status: newStatus } // update UI
            : task
        )
      }))
    );
  };

  useFocusEffect(
    useCallback(() => {
      retrieveTasks();
      fetchNudgeSent();
      fetchNudgeReceived();
      fetchProjectName();
      return () => {
      };
    }, [uid]) 
  );
  
  const [selectedProject, setSelectedProject] = useState(prjName);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const dropdownRef = useRef<View>(null);

  const handleSelectProject = () => {
    dropdownRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
      setDropdownLayout({ x, y, width, height });
      setIsModalVisible(true);
    });
  }

  const handleProjectSelection = (project: string) => {
    setSelectedProject(project);
  }

  const closeModal = () => {
    setIsModalVisible(false);
  }

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1">My Tasks</ThemedText>
        {/* {projectDropdownComponent(prjName, handleSelectProject, dropdownRef)} */}
      </ThemedView>

      <ThemedView style={styles.nudgeInfoContainer}>
        {nudgeCountComponent(<SendIcon size={RFValue(16)} color={Colors.light.blackSecondary} />, 'Nudge Sent', nudgeSent)}
        {nudgeCountComponent(<InboxIcon size={RFValue(16)} color={Colors.light.blackSecondary} />, 'Nudge Received', nudgeReceived)}
      </ThemedView>

      {/* { taskList.map((section) => (
        renderTaskSection(section.category, section.tasks)
      )) } */}

      {taskList.map(section =>
        renderTaskSection(section.category, section.tasks, handleStatusChange)
      )}


      {/* {projectSelectionModal(isModalVisible, closeModal, handleProjectSelection, selectedProject, dropdownLayout)} */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectDropdown: {
    paddingVertical: RFValue(4),
    paddingHorizontal: RFValue(8),
    borderRadius: RFValue(8),
    borderWidth: RFValue(0.5),
    borderColor: Colors.light.cardBorder,
    backgroundColor: Colors.light.card,
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: RFValue(4),
    alignItems: 'center',
  },
  nudgeInfoContainer: {
    flexDirection: 'row',
    gap: RFValue(6),
    marginBottom: RFValue(16),
  },
  nudgeComponent: {
    backgroundColor: Colors.light.card,
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(16),
    borderRadius: RFValue(8),
    borderWidth: RFValue(1),
    borderColor: Colors.light.cardBorder,
    flexDirection: 'column',
    alignItems: 'center',
    gap: RFValue(8),
    flex: 1,
    minWidth: RFValue(0),
  },
  todoSectionContainer: {
    flexDirection: 'column',
    gap: RFValue(4),
    marginBottom: RFValue(16),
  },
  todoHeader: {
    flexDirection: 'row',
    gap: RFValue(8),
    alignItems: 'center',
    marginBottom: RFValue(8),
  },
  noItemContainer: {
    paddingVertical: RFValue(16),
    borderRadius: RFValue(4),
    borderWidth: RFValue(0.5),
    borderColor: Colors.light.cardBorder,
    backgroundColor: Colors.light.card,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.light.card,
    borderRadius: RFValue(8),
    // paddingVertical: RFValue(12),
    // paddingHorizontal: RFValue(12),
    borderWidth: RFValue(1),
    borderColor: Colors.light.cardBorder,
    elevation: RFValue(5),
    flexDirection: 'column',
    // gap: RFValue(12),
  },
  modalOption: {
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(16),
    // borderRadius: RFValue(8),
    // marginBottom: RFValue(8),
  },
  selectedOption: {
    backgroundColor: Colors.light.background,
  },
  modalOptionText: {
    color: Colors.light.text,
  },
});
