import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { TrashIcon } from '../icons/trash-icon';

interface TaskDetailHeaderProps {
  tid: string; // The task ID passed from the screen
  gid?: string; // The group ID passed from the screen
}

export function TaskDetailHeader({ tid }: TaskDetailHeaderProps) {
  const router = useRouter();
  const { uid, groups } = useAuthStore();
  const gid = groups[0];
  
  // const { tid } = useLocalSearchParams();
  
  const handleDeleteTask = async () => {
    console.assert(gid, 'Group ID is required to delete a task');
    console.assert(tid, 'Task ID is required to delete a task');

    try {
      const res = await axios.delete(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/tasks/${gid}/${tid}`);
      const data = res.data;
      console.log(data.message);
    } catch (error) {
      console.error('Error deleting task:', error);
      // console.error('Failed req: ', `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/tasks/${gid}/${tid}`);
      Alert.alert('Error', 'Failed to delete the task. Please try again.');
      return;
    }

    router.back();
  };

  const handleMenuPress = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleDeleteTask,
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleMenuPress}>
      <TrashIcon size={RFValue(22)} color={Colors.light.tint} />
    </TouchableOpacity>
  );
}