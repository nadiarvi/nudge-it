import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { TrashIcon } from '../icons/trash-icon';

export function TaskDetailHeader() {
  const handleDeleteTask = () => {
    console.log('Delete task confirmed');
    // TODO: Implement actual delete task logic here
    
    // Navigate back to the calling screen
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
      <TrashIcon size={22} color={Colors.light.tint} />
    </TouchableOpacity>
  );
}