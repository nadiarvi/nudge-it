import { Alert, AlertButton } from 'react-native';

interface NudgeOptions {
  option2Enabled?: boolean;
  option3Enabled?: boolean;
}

export function useNudgeAlert() {
  const showNudgeAlert = (taskTitle: string, options: NudgeOptions = {}) => {
    const { option2Enabled = true, option3Enabled = true } = options;
    
    const buttons: AlertButton[] = [
      {
        text: 'Push Notification',
        onPress: () => console.log('Push Notification selected for task:', taskTitle),
      },
    ];

    if (option2Enabled) {
      buttons.push({
        text: 'Simulated Phone Call',
        onPress: () => console.log('Simulated Phone Call selected for task:', taskTitle),
      });
    }

    if (option3Enabled) {
      buttons.push({
        text: 'Report to TA',
        onPress: () => console.log('Report to TA selected for task:', taskTitle),
      });
    }

    buttons.push({
      text: 'Cancel',
      style: 'destructive',
      onPress: () => console.log('Nudge cancelled for task:', taskTitle),
    });

    Alert.alert(
      'Send Nudge',
      'Choose your nudge option:',
      buttons,
      { 
        cancelable: true,
        onDismiss: () => console.log('Alert dismissed for task:', taskTitle),
      }
    );
  };

  return { showNudgeAlert };
}