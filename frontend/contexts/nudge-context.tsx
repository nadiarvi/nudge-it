import { NudgeConfirmationModal, NudgeSelectionModal } from '@/components/ui/custom-alert';
import { User } from '@/types/user';
import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import { useAuthStore } from './auth-context';

interface NudgeOptions {
  option2Enabled?: boolean;
  option3Enabled?: boolean;
}

// interface ModalState {
//   showSelection: boolean;
//   showConfirmation: boolean;
//   taskTitle: string;
//   selectedNudgeType: string;
//   targetUser: User;
//   options: NudgeOptions;
// }

// nudge context.tsx
interface ModalState {
  showSelection: boolean;
  showConfirmation: boolean;
  taskTitle: string;
  tid: string; // Add tid to state
  selectedNudgeType: string;
  targetUserId: string; // Change to string ID
  targetUserName: string; // Add for display
  options: NudgeOptions;
}

interface NudgeContextType {
  showNudgeAlert: (
    tid: string, 
    taskTitle: string, 
    targetUser: User, 
    nudgeCount: number,
    // onSuccessCallback?: () => void
    targetUserName?: string,
  ) => void;
}

const NudgeContext = createContext<NudgeContextType | undefined>(undefined);

interface NudgeProviderProps {
  children: React.ReactNode;
}

export function NudgeProvider({ children }: NudgeProviderProps) {
  const { uid, groups } = useAuthStore();

  const [modalState, setModalState] = useState<ModalState>({
    showSelection: false,
    showConfirmation: false,
    taskTitle: '',
    selectedNudgeType: '',
    targetUser: '',
    options: {},
  });

  const showNudgeAlert = (
    tid: string, 
    taskTitle: string, 
    targetUser: string, 
    nudgeCount: number, 
    onSuccessCallback?: () => void
  ) => {
    const option2Enabled = nudgeCount >= 1;
    const option3Enabled = nudgeCount >= 2;
    
    setModalState({
      showSelection: true,
      showConfirmation: false,
      taskTitle,
      tid,
      selectedNudgeType: '',
      targetUser,
      options: { option2Enabled, option3Enabled },
      onSuccessCallback,
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

    const nudgeData = {
      type: modalState.selectedNudgeType,
      group_id: groups[0],
      task_id: modalState.tid,
      sender: uid,
      receiver: modalState.targetUser._id,
    }

    const sendNudge = async () => {
      try {
        const res = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/nudges/create`, nudgeData);
        if (res.status === 201) {
          console.log('Nudge sent successfully');
          if (modalState.onSuccessCallback) { // <--- Execute on successful API call
             modalState.onSuccessCallback();
          }
        } else {
          console.error('Failed to send nudge:', res.statusText);
        }
      } catch (error) {
        console.error('Error sending nudge:', error);
        console.log('failed req: ', `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/nudges/create`);
        console.log('nudge data: ', nudgeData);
      }
    }

    sendNudge();
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