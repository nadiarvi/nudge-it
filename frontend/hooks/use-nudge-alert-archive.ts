import { Alert, AlertButton } from 'react-native';

interface NudgeOptions {
  option2Enabled?: boolean;
  option3Enabled?: boolean;
}

export function useNudgeAlertArchive() {
  const showNudgeAlert = (taskTitle: string, options: NudgeOptions = {}) => {
    const { option2Enabled = false, option3Enabled = false } = options;
    
    const buttons: AlertButton[] = [
      {
        text: 'Push Notification',
        onPress: () => handlePushNotif(taskTitle),
      },
    ];

    if (option2Enabled) {
      buttons.push({
        text: 'Simulated Phone Call',
        onPress: () => handleSimulatedCall(taskTitle),
      });
    }

    if (option3Enabled) {
      buttons.push({
        text: 'Report to TA',
        onPress: () => handleReportToTA(taskTitle),
      });
    }

    buttons.push({
      text: 'Cancel',
      style: 'destructive',
      onPress: () => handleCancelNudge(taskTitle),
    });

    Alert.alert(
      'Send Nudge',
      'Choose your nudge option:',
      buttons,
      { 
        cancelable: true,
        onDismiss: () => handleCancelNudge(taskTitle),
      }
    );
  };

  return { showNudgeAlert };
}

const nudgeConfirmationMessage = (nudgeType: string) => {
  switch (nudgeType) {
    case 'Push Notification':
      return {
        title: 'Friendly Nudge',
        message: 'A gentle reminder will be sent to about their task through a push notification.'
      }
    case 'Simulated Phone Call':
      return 'A simulated phone call will be made to the assignee.';
    case 'Report to TA':
      return 'The issue will be reported to the TA.';
    default:
      return '';
  }
}

const showConfirmationAlert = (taskTitle: string, nudgeType: string) => {
  Alert.alert(
    'Confirm Nudge',
    `Are you sure you want to send a "${nudgeType}" for task "${taskTitle}"?`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => console.log(`Nudge cancelled for task: ${taskTitle}`),
      },
      {
        text: 'Send',
        style: 'default',
        onPress: () => handleNudgeConfirmation(taskTitle, nudgeType),
      },
    ],
    { cancelable: true }
  );
};

const handlePushNotif = (taskTitle: string) => {
  showConfirmationAlert(taskTitle, 'Push Notification');
};

const handleSimulatedCall = (taskTitle: string) => {
  showConfirmationAlert(taskTitle, 'Simulated Phone Call');
};

const handleReportToTA = (taskTitle: string) => {
  showConfirmationAlert(taskTitle, 'Report to TA');
};

const handleCancelNudge = (taskTitle: string) => {
  console.log('Nudge cancelled for task:', taskTitle);
};

const handleNudgeConfirmation = (taskTitle: string, selectedOption: string) => {
  console.log(`✅ Nudge sent successfully for task: "${taskTitle}" with option: "${selectedOption}"`);
};