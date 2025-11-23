import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { TaskCard } from '@/components/ui/task-card';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { TaskStatus } from '@/types/task';
import { useRouter } from 'expo-router';

import { FilterIcon } from '@/components/icons/filter-icon';
import { SortIcon } from '@/components/icons/sort-icon';

import { PlusIcon } from '@/components/icons/plus-icon';
import { ThemedTouchableView } from '@/components/ui';
import { ALL_TASKS } from '@/constants/dataPlaceholder';
import { Colors } from '@/constants/theme';

const taskLists = ALL_TASKS("Alice");

export default function TasksScreen() {
  const router = useRouter();

  const handleAddTask = () => {
    router.push({
      pathname: '/task-detail',
      params: { 
        id: 'new',
        title: '',
        deadline: '',
        assignedTo: '',
        status: 'To Do',
        reviewer: '',
        nudgeCount: 0,
      }
    });
  };

  const handleFilter = () => {
    // Implement filter logic here
    console.log('Filter button pressed');
  };

  const handleSort = () => {
    // Implement sort logic here
    console.log('Sort button pressed');
  };

  return (
   <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1" style={{ flex: 1 }}>Tasks</ThemedText>
        <ThemedView style={styles.actionContainer}>
          <ThemedTouchableView onPress={handleFilter}>
            <FilterIcon size={22} color={ Colors.light.tint }/>
          </ThemedTouchableView>
          <ThemedTouchableView onPress={handleSort}>
            <SortIcon size={22} color={ Colors.light.tint }/>
          </ThemedTouchableView>
          <ThemedTouchableView onPress={handleAddTask}>
            <PlusIcon size={22} color={ Colors.light.tint }/>
          </ThemedTouchableView>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.separator}/>

      <ThemedView style={{ gap: 8 }}>
      
      {taskLists.map((task, index) => (
        <TaskCard
          key={index}
          title={task.title}
          deadline={task.deadline}
          assignedTo={task.user}
          status={task.status as TaskStatus}
          reviewer={task.reviewer ?? null}
          nudgeCount={task.nudgeCount}
          onStatusChange={(newStatus) => {
            // Handle status change here
            console.log(`Task "${task.title}" status changed to: ${newStatus}`);
          }}
        />
      ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.light.cardBorder,
    marginTop: -4,
  }
});
