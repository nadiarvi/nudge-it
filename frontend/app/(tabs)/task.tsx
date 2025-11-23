import { FilterIcon, PlusIcon, SortIcon } from '@/components/icons';
import { FilterModal, ParallaxScrollView, SortModal, TaskCard, ThemedText, ThemedTouchableView, ThemedView } from '@/components/ui';
import { ALL_TASKS, MEMBER_LISTS } from '@/constants/dataPlaceholder';
import { Colors } from '@/constants/theme';
import { TaskStatus } from '@/types/task';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

const taskLists = ALL_TASKS("Alice");

const FILTER_OPTIONS = [
  {
    field: 'status',
    options: ['To Do', 'In Progress', 'In Review', 'Done'],
  },
  {
    field: 'assignedTo',
    options: MEMBER_LISTS,
  },
  {
    field: 'reviewer',
    options: MEMBER_LISTS,
  },
  {
    field: 'nudgeCount',
    options: ['0', '1', '2', '3+'],
  },
  {
    field: 'deadline',
    options: ['Today', 'This Week', 'This Month'],
  }
];

const SORT_OPTIONS = [
  { field: 'Deadline', condition: 'asc' },
  { field: 'Deadline', condition: 'desc' },
  { field: 'Nudge Count', condition: 'asc' },
  { field: 'Nudge Count', condition: 'desc' },
];

export default function TasksScreen() {
  const router = useRouter();
  const [filters, setFilters] = useState<{ [key: string]: string | null }>({
    status: null,
    assignedTo: null,
    reviewer: null,
    nudgeCount: null,
    deadline: null,
  });
  const [sortConditions, setSortConditions] = useState<{ [key: string]: string | null }>({
    'Deadline': null,
    'Nudge Count': null,
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  const filteredAndSortedTasks = useMemo(() => {
    let tasks = taskLists.filter(task => {
      // Check status filter
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      // Check assignedTo filter
      if (filters.assignedTo && task.user !== filters.assignedTo) {
        return false;
      }

      // Check reviewer filter
      if (filters.reviewer && task.reviewer !== filters.reviewer) {
        return false;
      }

      // Check nudgeCount filter
      if (filters.nudgeCount) {
        if (filters.nudgeCount === '3+' && task.nudgeCount < 3) {
          return false;
        } else if (filters.nudgeCount !== '3+' && task.nudgeCount.toString() !== filters.nudgeCount) {
          return false;
        }
      }

      // Check deadline filter (basic implementation)
      if (filters.deadline) {
        const today = new Date();
        const taskDeadline = new Date(task.deadline);
        
        if (filters.deadline === 'Today') {
          if (taskDeadline.toDateString() !== today.toDateString()) {
            return false;
          }
        } else if (filters.deadline === 'This Week') {
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);
          if (taskDeadline < today || taskDeadline > weekFromNow) {
            return false;
          }
        } else if (filters.deadline === 'This Month') {
          if (taskDeadline.getMonth() !== today.getMonth() || 
              taskDeadline.getFullYear() !== today.getFullYear()) {
            return false;
          }
        }
      }

      return true;
    });

    // Apply sorting - sort by multiple conditions in priority order
    const activeSorts = Object.entries(sortConditions).filter(([_, condition]) => condition !== null);
    
    if (activeSorts.length > 0) {
      tasks = [...tasks].sort((a, b) => {
        // Try each sort condition in order until we get a non-zero result
        for (const [field, condition] of activeSorts) {
          let result = 0;
          
          switch (field) {
            case 'Deadline':
              const dateA = new Date(a.deadline).getTime();
              const dateB = new Date(b.deadline).getTime();
              result = condition === 'asc' ? dateA - dateB : dateB - dateA;
              break;
            
            case 'Nudge Count':
              result = condition === 'asc'
                ? a.nudgeCount - b.nudgeCount
                : b.nudgeCount - a.nudgeCount;
              break;
          }
          
          // If we got a non-zero result, return it (this field determined the order)
          if (result !== 0) return result;
        }
        
        // All sort conditions resulted in equality
        return 0;
      });
    }

    return tasks;
  }, [filters, sortConditions])

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
    setIsFilterModalVisible(true);
  };

  const handleSort = () => {
    setIsSortModalVisible(true);
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== null);
  const hasActiveSort = Object.values(sortConditions).some(condition => condition !== null);

  return (
   <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1" style={{ flex: 1 }}>Tasks</ThemedText>
        <ThemedView style={styles.actionContainer}>
          <ThemedTouchableView onPress={handleFilter}>
            <FilterIcon 
              size={22} 
              color={hasActiveFilters ? Colors.light.tint : Colors.light.blackSecondary}
              variant={hasActiveFilters ? 'solid' : 'outline'}
            />
          </ThemedTouchableView>
          <ThemedTouchableView onPress={handleSort}>
            <SortIcon 
              size={22} 
              color={hasActiveSort ? Colors.light.tint : Colors.light.blackSecondary}
              strokeWidth={hasActiveSort ? 2 : 1.5}
            />
          </ThemedTouchableView>
          <ThemedTouchableView onPress={handleAddTask}>
            <PlusIcon size={22} color={Colors.light.blackSecondary}/>
          </ThemedTouchableView>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.separator}/>

      <ThemedView style={{ gap: 8 }}>
      
      {filteredAndSortedTasks.map((task, index) => (
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

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        selectedFilters={filters}
        onFiltersApply={setFilters}
        filterOptions={FILTER_OPTIONS}
      />

      <SortModal
        visible={isSortModalVisible}
        onClose={() => setIsSortModalVisible(false)}
        selectedSorts={sortConditions}
        onSortsApply={setSortConditions}
        sortOptions={SORT_OPTIONS}
      />
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
