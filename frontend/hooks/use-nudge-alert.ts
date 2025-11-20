import { useState } from 'react';

interface NudgeOptions {
  option2Enabled?: boolean;
  option3Enabled?: boolean;
}

interface ModalState {
  showSelection: boolean;
  showConfirmation: boolean;
  taskTitle: string;
  selectedNudgeType: string;
  options: NudgeOptions;
}

export function useNudgeAlert() {
  const [modalState, setModalState] = useState<ModalState>({
    showSelection: false,
    showConfirmation: false,
    taskTitle: '',
    selectedNudgeType: '',
    options: {},
  });

  const showNudgeAlert = (taskTitle: string, options: NudgeOptions = {}) => {
    setModalState({
      showSelection: true,
      showConfirmation: false,
      taskTitle,
      selectedNudgeType: '',
      options,
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
      options: {},
    });
  };

  return { 
    showNudgeAlert, 
    modalState,
    handleNudgeSelection,
    handleConfirm,
    handleClose
  };
}