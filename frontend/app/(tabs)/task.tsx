import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TaskStatus } from '@/components/ui/status-dropdown';
import { TaskCard } from '@/components/ui/task-card';

const taskLists = [
  {
    milestone: "DP3",
    tasks: [{
      title: "Implement user authentication",
      deadline: "Fri, 24 Oct 2025",
      user: "Alice",
      status: "In Review" as TaskStatus,
    }, {
      title: "Design database schema",
      deadline: "Mon, 27 Oct 2025",
      user: "Bob",
      status: "To Do" as TaskStatus,
    }]
  }
]

export default function TasksScreen() {
  return (
   <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1">CS473 Social Computing</ThemedText>
      </ThemedView>
      <ThemedView style={styles.separator}/>

      {taskLists.map((list) => (
        <ThemedView key={list.milestone} style={{marginTop: 16, marginBottom: 8, gap: 8}}>
          <ThemedText type="H2">{list.milestone}</ThemedText>
          {list.tasks.map((task, index) => (
            <TaskCard
              key={index}
              title={task.title}
              deadline={task.deadline}
              assignedTo={task.user}
              status={task.status}
              onStatusChange={(newStatus) => {
                // Handle status change here
                console.log(`Task "${task.title}" status changed to: ${newStatus}`);
              }}
            />
          ))}
        </ThemedView>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#CCCCCC',
    marginVertical: 2,
  }
});
