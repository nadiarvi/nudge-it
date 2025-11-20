import { BellIcon } from '@/components/icons/bell-icon';
import { FlagIcon } from '@/components/icons/flag-icon';
import { UserCircleIcon } from '@/components/icons/user-circle-icon';
import { ThemedButton } from '@/components/ui/themed-button';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Colors } from '@/constants/theme';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function CustomAlert({ visible, onClose, title, children }: CustomAlertProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <ThemedView style={styles.modal}>
            <ThemedText type="H2" style={styles.title}>{title}</ThemedText>
            {children}
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface NudgeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  taskTitle: string;
  options: {
    option2Enabled?: boolean;
    option3Enabled?: boolean;
  };
  onSelectNudge: (nudgeType: string) => void;
}

export function NudgeSelectionModal({ 
  visible, 
  onClose, 
  taskTitle, 
  options, 
  onSelectNudge 
}: NudgeSelectionModalProps) {
  const { option2Enabled = false, option3Enabled = false } = options;

  return (
    <CustomAlert visible={visible} onClose={onClose} title="Send Nudge">
      <ThemedText type="Body2" style={styles.subtitle}>
        Choose your nudge option for "{taskTitle}":
      </ThemedText>
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.nudgeOption} 
          onPress={() => onSelectNudge('Push Notification')}
        >
          <View style={styles.optionContent}>
            <BellIcon size={24} color={Colors.light.tint} />
            <View style={styles.optionText}>
              <ThemedText type="H3">Push Notification</ThemedText>
              <ThemedText type="Body3" style={styles.optionDescription}>
                Send a gentle reminder notification
              </ThemedText>
            </View>
          </View>
        </Pressable>

        {option2Enabled && (
          <Pressable 
            style={styles.nudgeOption} 
            onPress={() => onSelectNudge('Simulated Phone Call')}
          >
            <View style={styles.optionContent}>
              <UserCircleIcon size={24} color={Colors.light.tint} />
              <View style={styles.optionText}>
                <ThemedText type="H3">Simulated Phone Call</ThemedText>
                <ThemedText type="Body3" style={styles.optionDescription}>
                  Make a simulated phone call reminder
                </ThemedText>
              </View>
            </View>
          </Pressable>
        )}

        {option3Enabled && (
          <Pressable 
            style={styles.nudgeOption} 
            onPress={() => onSelectNudge('Report to TA')}
          >
            <View style={styles.optionContent}>
              <FlagIcon size={24} color={Colors.light.red} />
              <View style={styles.optionText}>
                <ThemedText type="H3">Report to TA</ThemedText>
                <ThemedText type="Body3" style={styles.optionDescription}>
                  Escalate the issue to teaching assistant
                </ThemedText>
              </View>
            </View>
          </Pressable>
        )}

        <ThemedButton
          onPress={onClose}
          variant="secondary"
          style={styles.cancelButton}
        >
          Cancel
        </ThemedButton>
      </View>
    </CustomAlert>
  );
}

interface NudgeConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  taskTitle: string;
  nudgeType: string;
  onConfirm: () => void;
}

export function NudgeConfirmationModal({ 
  visible, 
  onClose, 
  taskTitle, 
  nudgeType, 
  onConfirm 
}: NudgeConfirmationModalProps) {
  const getIcon = () => {
    switch (nudgeType) {
      case 'Push Notification':
        return <BellIcon size={32} color={Colors.light.tint} />;
      case 'Simulated Phone Call':
        return <UserCircleIcon size={32} color={Colors.light.tint} />;
      case 'Report to TA':
        return <FlagIcon size={32} color={Colors.light.red} />;
      default:
        return <BellIcon size={32} color={Colors.light.tint} />;
    }
  };

  const getDescription = () => {
    switch (nudgeType) {
      case 'Push Notification':
        return 'A gentle reminder will be sent through a push notification.';
      case 'Simulated Phone Call':
        return 'A simulated phone call will be made to the assignee.';
      case 'Report to TA':
        return 'The issue will be reported to the teaching assistant.';
      default:
        return '';
    }
  };

  return (
    <CustomAlert visible={visible} onClose={onClose} title="Confirm Nudge">
      <View style={styles.confirmationContent}>
        {getIcon()}
        <ThemedText type="Body2" style={styles.confirmationText}>
          Are you sure you want to send a "{nudgeType}" for task "{taskTitle}"?
        </ThemedText>
        <ThemedText type="Body3" style={styles.confirmationDescription}>
          {getDescription()}
        </ThemedText>
      </View>
      
      <View style={styles.confirmationButtons}>
        <ThemedButton
          onPress={onClose}
          variant="secondary"
          style={styles.confirmationButton}
        >
          Cancel
        </ThemedButton>
        <ThemedButton
          onPress={onConfirm}
          variant="primary"
          style={styles.confirmationButton}
        >
          Send Nudge
        </ThemedButton>
      </View>
    </CustomAlert>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    // maxWidth: 400,
  },
  modal: {
    borderRadius: 12,
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.light.blackSecondary,
  },
  buttonContainer: {
    gap: 12,
  },
  nudgeOption: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    flex: 1,
    gap: 4,
  },
  optionDescription: {
    color: Colors.light.blackSecondary,
  },
  cancelButton: {
    marginTop: 8,
  },
  confirmationContent: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  confirmationText: {
    textAlign: 'center',
  },
  confirmationDescription: {
    textAlign: 'center',
    color: Colors.light.blackSecondary,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmationButton: {
    flex: 1,
  },
});