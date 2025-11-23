import { BellIcon } from '@/components/icons/bell-icon';
import { CallIcon } from '@/components/icons/call-icon';
import { FlagIcon } from '@/components/icons/flag-icon';
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
            {title && <ThemedText type="H1" style={styles.title}>{title}</ThemedText>}
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
        {/* Choose your nudge option for "{taskTitle}": */}
        Choose the level of reminder you want to send
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
              <CallIcon size={24} color={Colors.light.tint} />
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
                  Escalate the issue to the TA
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
  targetUser: string;
  onConfirm: () => void;
}

export function NudgeConfirmationModal({ 
  visible, 
  onClose, 
  taskTitle, 
  nudgeType,
  targetUser, 
  onConfirm 
}: NudgeConfirmationModalProps) {
  const getIcon = () => {
    const ICON_SIZE = 24;
    const STROKE_WIDTH = 2;
    switch (nudgeType) {
      case 'Push Notification':
        return <BellIcon size={ICON_SIZE} strokeWidth={STROKE_WIDTH} color={Colors.light.tint} />;
      case 'Simulated Phone Call':
        return <CallIcon size={ICON_SIZE} strokeWidth={STROKE_WIDTH} color={Colors.light.tint} />;
      case 'Report to TA':
        return <FlagIcon size={ICON_SIZE} strokeWidth={STROKE_WIDTH} color={Colors.light.red} />;
      default:
        console.log('DEBUG: Falling back to default BellIcon');
        return <BellIcon size={ICON_SIZE} color={Colors.light.tint} />;
    }
  };

  const getDescription = () => {
    switch (nudgeType) {
      case 'Push Notification':
        return 'A gentle reminder will be sent through a push notification.';
      case 'Simulated Phone Call':
        return 'A simulated phone call will be sent as a stronger reminder to complete their task.';
      case 'Report to TA':
        return 'This will notify the TA that this person has not completed their task after multiple reminders.';
      default:
        return '';
    }
  };

  const SeverityIndicator = ({ nudgeType }: { nudgeType: string }) => {
    const getSeverityColor = () => {
      switch (nudgeType) {
        case 'Push Notification':
          return Colors.light.green;
        case 'Simulated Phone Call':
          return Colors.light.yellow;
        case 'Report to TA':
          return Colors.light.red;
        default:
          return Colors.light.blackSecondary;
      }
    };

    const getInactiveDotColor = () => {
      return Colors.light.cardBorder; // Light gray for inactive dots
    };

    const getDotColors = () => {
      const activeColor = getSeverityColor();
      const inactiveColor = getInactiveDotColor();
      
      switch (nudgeType) {
        case 'Push Notification':
          return [activeColor, inactiveColor, inactiveColor]; // Only left dot
        case 'Simulated Phone Call':
          return [inactiveColor, activeColor, inactiveColor]; // Only middle dot
        case 'Report to TA':
          return [inactiveColor, inactiveColor, activeColor]; // Only right dot
        default:
          return [inactiveColor, inactiveColor, inactiveColor];
      }
    };

    const dotColors = getDotColors();

    const DOT_SIZE = 12;
    
    return (
        <View style={{ flexDirection: 'row', gap: DOT_SIZE, alignItems: 'center' }}>
            <View style={{ width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: dotColors[0] }}></View>
            <View style={{ width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: dotColors[1] }}></View>
            <View style={{ width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: dotColors[2] }}></View>
        </View>
    );
  };

  return (
    <CustomAlert visible={visible} onClose={onClose} title="">
      <View style={styles.titleWithIcon}>
        {getIcon()}
        <ThemedText type="H1" style={styles.titleText}>Confirm Nudge</ThemedText>
      </View>
      <View style={styles.confirmationContent}>
        <ThemedText type="Body2" style={styles.confirmationText}>
          {getDescription()}
        </ThemedText>

        <View style={{ alignItems: 'center', flexDirection: 'column', gap: 8 }}>
            <ThemedText type="Body1" style={styles.confirmationDescription}>
            Nudge Level
            </ThemedText>
            <SeverityIndicator nudgeType={nudgeType} />
        </View>

        <ThemedText type="H3" style={[ styles.confirmationText, { color: Colors.light.tint, fontWeight: '400' } ]}>
          Send this nudge to <ThemedText style={{ fontWeight: '800', color: Colors.light.tint }}>{targetUser}</ThemedText>?
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
  },
  modal: {
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderWidth: 0.5,
    borderColor: Colors.light.cardBorder,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.light.tint,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: Colors.light.text,
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
    gap: 14,
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
    fontWeight: '500',
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmationButton: {
    flex: 1,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 18,
  },
  titleText: {
    textAlign: 'center',
    color: Colors.light.tint,
  },
});