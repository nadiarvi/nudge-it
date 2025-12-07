import { BellIcon } from '@/components/icons/bell-icon';
import { UserCircleIcon } from '@/components/icons/user-circle-icon';
import { StatusDropdown } from '@/components/ui/status-dropdown';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedTouchableView } from '@/components/ui/touchable-themed-view';
import { Colors, StatusColors } from '@/constants/theme';
// import { useAuth } from '@/contexts/auth-context';
import { useAuthStore } from '@/contexts/auth-context';
import { useNudgeAlert } from '@/contexts/nudge-context';
import { TaskCardProps } from '@/types/task';
import { formatDate } from '@/utils/date-formatter';
import { formatDisplayName } from '@/utils/name-formatter';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlagIcon } from '../icons/flag-icon';
import { SearchIcon } from '../icons/search-icon';

export function TaskCard({ 
  id,
  title, 
  deadline, 
  assignedTo, 
  status,
  reviewer = null,
  nudgeCount = 0,
  onStatusChange = () => {},
  onNudgeSent = () => {},
}: TaskCardProps) {
  const router = useRouter();
  const { uid, groups, first_name } = useAuthStore();
  const gid = groups[0];
  const { showNudgeAlert } = useNudgeAlert();

  const [showNudgeButton, setShowNudgeButton] = useState(false);
  const formattedDeadline = formatDate(deadline);

  const handlePress = () => {
    router.push({
      pathname: '/task-detail',
      params: { 
        tid: id
      }
    });
  };

  const handleNudge = () => {
    showNudgeAlert(id, title, assignedTo, nudgeCount, onNudgeSent);
    // onNudgeSent();
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await axios.patch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/tasks/${gid}/${id}`,
        { status: newStatus }
      );

      // Immediately update UI in parent
      onStatusChange(newStatus);

    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const MAX_TITLE_LENGTH = 23;

  const truncatedTitle = title.length > MAX_TITLE_LENGTH 
                            ? title.substring(0, MAX_TITLE_LENGTH) + "..." 
                            : title;

  useEffect(() => {
    //console.log(`assignedTo in TaskCard: ${assignedTo._id}, ${assignedTo.first_name}`);
    const show = uid === assignedTo._id;
    setShowNudgeButton(!show);
  }, [uid, assignedTo]);

  return (
    <ThemedTouchableView style={styles.taskCard} onPress={handlePress}>
      <ThemedView style={styles.leftSection}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <ThemedText type="H3">{nudgeCount >= 3 ? truncatedTitle : title}</ThemedText>
          { nudgeCount > 0 && (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <FlagIcon size={18} color={Colors.light.red} strokeWidth={2}/>
              <ThemedText type="Body3" style={{color: Colors.light.red}}>{`${nudgeCount}`}</ThemedText>
              {/* { nudgeCount >= 3 && (
                <ThemedText type="Body3" style={{color: Colors.light.red}}>| TA</ThemedText>
              )} */}
            </View>
          )}
        </View>
        <ThemedText type="Body3" style={{color: Colors.light.blackSecondary}}>{formattedDeadline}</ThemedText>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
          <UserCircleIcon size={12} color={Colors.light.tint} />
          <ThemedText type="Body3" style={{color: Colors.light.tint}}>{formatDisplayName(assignedTo.first_name)}</ThemedText>
          { status !== "To-Do" && (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <ThemedText type="Body3" style={{color: Colors.light.blackSecondary}}>
                |
              </ThemedText>
              <SearchIcon size={12} color={ reviewer ? StatusColors.inReview : Colors.light.blackSecondary} />
              <ThemedText type="Body3" style={{color: reviewer ? StatusColors.inReview : Colors.light.blackSecondary}}>
                {/* {reviewer ? `${reviewer[0].first_name}` : "Not Assigned"} */}
                { reviewer && reviewer.length > 0
                    ? `${formatDisplayName(reviewer[0].first_name)}` 
                    : "Not Assigned"
                }
              </ThemedText>
            </View>
          )}
        </View>
      </ThemedView>
      <ThemedView style={styles.rightSection}>
        {showNudgeButton ? (
          <ThemedTouchableView onPress={handleNudge} style={{ marginLeft: 8, backgroundColor: 'transparent' }}>
            <BellIcon size={24} color={Colors.light.blackSecondary} />
          </ThemedTouchableView>
        ) : (
          <View style={{ height: 24 }} />
        )}
        <StatusDropdown 
          value={status}
          onValueChange={handleStatusUpdate}
        />
      </ThemedView>
    </ThemedTouchableView>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 0.3,
    borderColor: Colors.light.cardBorder,
    backgroundColor: Colors.light.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    backgroundColor: Colors.light.card,
    flexDirection: 'column',
    gap: 4,
  },
  rightSection: {
    backgroundColor: Colors.light.card,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  }
});