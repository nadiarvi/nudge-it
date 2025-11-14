import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function TaskDetailPage() {
  return (
    <>
        <ThemedView style={styles.header}>
            <ThemedText type="H1">Task Detail</ThemedText>
        </ThemedView>
        <ThemedView>
            <ThemedText>Task Detail Page</ThemedText>
        </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
    header: {
        paddingBottom: 16,
        backgroundColor: 'red',
    }
});