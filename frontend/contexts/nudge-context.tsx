import { NudgeConfirmationModal, NudgeSelectionModal } from '@/components/ui/custom-alert';
import React, { createContext, useContext, useState } from 'react';

interface NudgeOptions {
  option2Enabled?: boolean;
  option3Enabled?: boolean;
}

interface ModalState {
  showSelection: boolean;
  showConfirmation: boolean;
  taskTitle: string;
  selectedNudgeType: string;
  targetUser: string;
  options: NudgeOptions;
}

interface NudgeContextType {
  showNudgeAlert: (taskTitle: string, targetUser: string, nudgeCount: number) => void;
}

const NudgeContext = createContext<NudgeContextType | undefined>(undefined);

interface NudgeProviderProps {
  children: React.ReactNode;
}

export function NudgeProvider({ children }: NudgeProviderProps) {
  const [modalState, setModalState] = useState<ModalState>({
    showSelection: false,
    showConfirmation: false,
    taskTitle: '',
    selectedNudgeType: '',
    targetUser: '',
    options: {},
  });

  const showNudgeAlert = (taskTitle: string, targetUser: string, nudgeCount: number) => {
    // Calculate which options should be enabled based on nudge count
    const option2Enabled = nudgeCount >= 1;
    const option3Enabled = nudgeCount >= 2;
    
    setModalState({
      showSelection: true,
      showConfirmation: false,
      taskTitle,
      selectedNudgeType: '',
      targetUser,
      options: { option2Enabled, option3Enabled },
    });
  };

  const handleNudgeSelection = (nudgeType: string) => {
    setModalState(prev => ({
      ...prev,
      showSelection: false,
      showConfirmation: true,
      selectedNudgeType: nudgeType,
    }));
  };

  const handleConfirm = () => {
    console.log(`✅ Nudge sent successfully for task: "${modalState.taskTitle}" with option: "${modalState.selectedNudgeType}"`);
    handleClose();
  };

  const handleClose = () => {
    setModalState({
      showSelection: false,
      showConfirmation: false,
      taskTitle: '',
      selectedNudgeType: '',
      targetUser: '',
      options: {},
    });
  };

  return (
    <NudgeContext.Provider value={{ showNudgeAlert }}>
      {children}
      <NudgeSelectionModal
        visible={modalState.showSelection}
        onClose={handleClose}
        taskTitle={modalState.taskTitle}
        options={modalState.options}
        onSelectNudge={handleNudgeSelection}
      />
      <NudgeConfirmationModal
        visible={modalState.showConfirmation}
        onClose={handleClose}
        taskTitle={modalState.taskTitle}
        nudgeType={modalState.selectedNudgeType}
        targetUser={modalState.targetUser}
        onConfirm={handleConfirm}
      />
    </NudgeContext.Provider>
  );
}

export function useNudgeAlert() {
  const context = useContext(NudgeContext);
  if (context === undefined) {
    throw new Error('useNudgeAlert must be used within a NudgeProvider');
  }
  return context;
}