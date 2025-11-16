import { StyleSheet } from 'react-native';

import { ThemedTouchableView } from '@/components/ui';
import ParallaxScrollView from '@/components/ui/parallax-scroll-view';
import { TaskStatus } from '@/components/ui/status-dropdown';
import { TaskCard } from '@/components/ui/task-card';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

// Dummy Data -- @BE to replace with real data from backend
const taskLists = [
  {
    milestone: "DP3",
    tasks: [
    {
      title: "Implement user authentication",
      deadline: "Fri, 24 Oct 2025",
      user: "Alice",
      status: "To Do" as TaskStatus,
    }, 
    {
      title: "Implement user authentication",
      deadline: "Fri, 24 Oct 2025",
      user: "Alice",
      status: "Revise" as TaskStatus,
    },
    {  
      title: "Design database schema",
      deadline: "Mon, 27 Oct 2025",
      user: "Bob",
      status: "In Review" as TaskStatus,
      reviewer: "Eve",
    }, 
    {
      title: "Design the chatbox",
      deadline: "Wed, 29 Oct 2025",
      user: "Charlie",
      status: "In Review" as TaskStatus,
      reviewer: "Not Assigned",
    },
    {
      title: "Implement user authentication",
      deadline: "Fri, 24 Oct 2025",
      user: "Alice",
      status: "To Do" as TaskStatus,
    }, 
  ]
  }
]

export default function TasksScreen() {
  const router = useRouter();

  const handleAddTask = () => {
    router.push({
      pathname: '/task-detail',
      params: { 
        id: 'new', // Special ID to indicate new task creation
        title: '',
        deadline: '',
        assignedTo: '',
        status: 'To Do',
        reviewer: '',
      }
    });
  };

  return (
   <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="H1">Tasks</ThemedText>
      </ThemedView>
      <ThemedView style={styles.separator}/>

      {taskLists.map((list) => (
        <ThemedView key={list.milestone} style={{gap: 8}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <ThemedText type="H2">{list.milestone}</ThemedText>
            <ThemedTouchableView onPress={handleAddTask}>
              <ThemedText type="Body2">+ Task</ThemedText>
            </ThemedTouchableView>
          </View>
          {list.tasks.map((task, index) => (
            <TaskCard
              key={index}
              title={task.title}
              deadline={task.deadline}
              assignedTo={task.user}
              status={task.status}
              reviewer={task.reviewer ?? null}
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
