import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';

import { ArrowIcon } from '@/components/icons/arrow-icon';
import { ClockIcon } from '@/components/icons/clock-icon';
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

export default function HomeScreen() {
  const CURRENT_USER = 'Alice';

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1">My Tasks</ThemedText>
      </ThemedView>
      
      {/* issue: the two component is not having the same width */}
      <ThemedView style={styles.nudgeInfoContainer}>
        {nudgeCountComponent(<SendIcon size={20} color={Colors.light.blackSecondary} />, 'Nudge Sent', 3)}
        {nudgeCountComponent(<InboxIcon size={20} color={Colors.light.blackSecondary} />, 'Nudge Received', 5)}
      </ThemedView>

      { MY_TASKS(CURRENT_USER).map((section) => (
        renderTaskSection(section.category, section.tasks)
      )) }

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
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
  }
});
