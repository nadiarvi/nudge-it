import React, { ReactElement, useRef, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';

import { ArrowIcon } from '@/components/icons/arrow-icon';
import { ClockIcon } from '@/components/icons/clock-icon';
import { DropdownIcon } from '@/components/icons/dropdown-icon';
import { InboxIcon } from '@/components/icons/inbox-icon';
import { SendIcon } from '@/components/icons/send-icon';
import { TodoIcon } from '@/components/icons/todo-icon';

import { ThemedTouchableView } from '@/components/ui';
import { Colors } from '@/constants/theme';

import { CheckIcon } from '@/components/icons/check-icon';
import { TaskCard } from '@/components/ui';

import { MY_TASKS } from '@/constants/dataPlaceholder';

const nudgeCountComponent = (icon: ReactElement, title: string, count: number) => (
  <ThemedView style={styles.nudgeComponent}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {icon}
      <ThemedText type='H3' style={{color: Colors.light.blackSecondary}}>{title}</ThemedText>
    </View>
    <ThemedText type='H1'>{count}</ThemedText>
  </ThemedView>
)

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'To Do':
      return <TodoIcon size={22} color={Colors.light.blackSecondary} />;
    case 'To Review':
      return <CheckIcon size={22} color={Colors.light.blackSecondary} />;
    case 'Pending for Review':
      return <ClockIcon size={22} color={Colors.light.blackSecondary} />;
    default:
      return <TodoIcon size={22} color={Colors.light.blackSecondary} />;
  }
}

const renderTaskSection = (category: string, tasks: any[]) => (
  <ThemedView key={category} style={styles.todoSectionContainer}>
    <View style={styles.todoHeader}>
      {getCategoryIcon(category)}
      <ThemedText style={{ flex: 1, color: Colors.light.blackSecondary }} type='H2'>{category} ({tasks.length})</ThemedText>
      <ThemedTouchableView>
        <ArrowIcon size={20} color={Colors.light.blackSecondary} />
      </ThemedTouchableView>
    </View>
    {tasks.length > 0 ? (
      tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          deadline={task.deadline}
          assignedTo={task.assignedTo}
          status={task.status}
          reviewer={task.reviewer}
          nudgeCount={task.nudgeCount}
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
  <TouchableOpacity ref={dropdownRef} style={styles.projectDropdown} onPress={onPress}>
    <ThemedText type='Body2' style={{color: Colors.light.tint}}>{projectName}</ThemedText>
    <DropdownIcon size={12} strokeWidth={3} color={Colors.light.tint} />
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
              // left: dropdownLayout.x, // Align left edge with dropdown left edge
              right: 24,
              // minWidth: Math.max(dropdownLayout.width, 200),
              maxWidth: 320,
            } : {
              // Fallback: center the modal if no layout is available
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


export default function HomeScreen() {
  const CURRENT_USER = 'Alice';
  const [selectedProject, setSelectedProject] = useState('CS473 Social Computing');
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
        {projectDropdownComponent(selectedProject, handleSelectProject, dropdownRef)}
      </ThemedView>

      <ThemedView style={styles.nudgeInfoContainer}>
        {nudgeCountComponent(<SendIcon size={20} color={Colors.light.blackSecondary} />, 'Nudge Sent', 3)}
        {nudgeCountComponent(<InboxIcon size={20} color={Colors.light.blackSecondary} />, 'Nudge Received', 5)}
      </ThemedView>

      { MY_TASKS(CURRENT_USER).map((section) => (
        renderTaskSection(section.category, section.tasks)
      )) }

      {projectSelectionModal(isModalVisible, closeModal, handleProjectSelection, selectedProject, dropdownLayout)}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectDropdown: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors.light.tint,
    backgroundColor: Colors.light.lightTint,
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  nudgeInfoContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  nudgeComponent: {
    backgroundColor: Colors.light.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  todoSectionContainer: {
    flexDirection: 'column',
    gap: 4,
    marginBottom: 16,
  },
  todoHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  noItemContainer: {
    paddingVertical: 16,
    borderRadius: 4,
    borderWidth: 0.5,
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
    borderRadius: 8,
    // paddingVertical: 12,
    // paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    elevation: 5,
    flexDirection: 'column',
    // gap: 12,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    // borderRadius: 8,
    // marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: Colors.light.background,
  },
  modalOptionText: {
    color: Colors.light.text,
  },
});
