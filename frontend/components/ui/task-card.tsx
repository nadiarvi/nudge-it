// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { StyleSheet, View } from 'react-native';
// import { RFValue } from 'react-native-responsive-fontsize';

// import {
//   BellIcon,
//   FlagIcon,
//   SearchIcon,
//   UserCircleIcon
// } from '@/components/icons';

// import {
//   StatusDropdown,
//   ThemedText,
//   ThemedTouchableView,
//   ThemedView
// } from '@/components/ui';

// import { Colors, StatusColors } from '@/constants/theme';
// import { useAuthStore } from '@/contexts/auth-context';
// import { useNudgeAlert } from '@/contexts/nudge-context';
// import { TaskCardProps } from '@/types/task';
// import { formatDate } from '@/utils/date-formatter';
// import { formatDisplayName } from '@/utils/name-formatter';



// export function TaskCard({ 
//   id,
//   title, 
//   deadline, 
//   assignedTo, 
//   status,
//   reviewer = null,
//   nudgeCount = 0,
//   onStatusChange = () => {},
//   onNudgeSent = () => {},
// }: TaskCardProps) {
//   const router = useRouter();
//   const { uid, groups, first_name } = useAuthStore();
//   const gid = groups[0];
//   const { showNudgeAlert } = useNudgeAlert();

//   const [showNudgeButton, setShowNudgeButton] = useState(false);
//   const formattedDeadline = formatDate(deadline);

//   const handlePress = () => {
//     router.push({
//       pathname: '/task-detail',
//       params: { 
//         tid: id
//       }
//     });
//   };

//   const handleNudge = () => {
//     const shouldNudgeReviewer = status === "In Review" && reviewer && reviewer.length > 0;
//     const targetUid = shouldNudgeReviewer ? reviewer[0]._id : assignedTo._id;
//     const targetUser = shouldNudgeReviewer ? reviewer[0] : assignedTo;

//     showNudgeAlert(id, title, targetUser, nudgeCount, onNudgeSent);
//     // onNudgeSent();
//   };

//   const handleStatusUpdate = async (newStatus: string) => {
//     try {
//       await axios.patch(
//         `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/tasks/${gid}/${id}`,
//         { status: newStatus }
//       );

//       // Immediately update UI in parent
//       onStatusChange(newStatus);

//     } catch (error) {
//       console.error("Failed to update task status:", error);
//     }
//   };

//   const MAX_TITLE_LENGTH = 23;

//   const truncatedTitle = title.length > MAX_TITLE_LENGTH 
//                             ? title.substring(0, MAX_TITLE_LENGTH) + "..." 
//                             : title;

//   useEffect(() => {
//     const isInReview = status === "In Review";

//     if (isInReview && reviewer && reviewer.length > 0) {
//       const isCurrentUserReviewer = uid === reviewer[0]._id;
//       setShowNudgeButton(!isCurrentUserReviewer);
//     } else {
//       const isCurrentUserAssignee = uid === assignedTo._id;
//       setShowNudgeButton(!isCurrentUserAssignee);
//     }
//   }, [uid, assignedTo, reviewer, status]);

//   return (
//     <ThemedTouchableView style={styles.taskCard} onPress={handlePress}>
//       <ThemedView style={styles.leftSection}>
//         <View style={{flexDirection: 'row', alignItems: 'center', gap: RFValue(8)}}>
//           <ThemedText type="H3">{nudgeCount >= 3 ? truncatedTitle : title}</ThemedText>
//           { nudgeCount > 0 && (
//             <View style={{flexDirection: 'row', alignItems: 'center', gap: RFValue(4)}}>
//               <FlagIcon size={RFValue(18)} color={Colors.light.red} strokeWidth={RFValue(2)}/>
//               <ThemedText type="Body3" style={{color: Colors.light.red}}>{`${nudgeCount}`}</ThemedText>
//               {/* { nudgeCount >= 3 && (
//                 <ThemedText type="Body3" style={{color: Colors.light.red}}>| TA</ThemedText>
//               )} */}
//             </View>
//           )}
//         </View>
//         <ThemedText type="Body3" style={{color: Colors.light.blackSecondary}}>{formattedDeadline}</ThemedText>
//         <View style={{flexDirection: 'row', alignItems: 'center', gap: RFValue(4)}}>
//           <UserCircleIcon size={RFValue(12)} color={Colors.light.tint} />
//           <ThemedText type="Body3" style={{color: Colors.light.tint}}>{formatDisplayName(assignedTo.first_name)}</ThemedText>
//           { status !== "To-Do" && (
//             <View style={{flexDirection: 'row', alignItems: 'center', gap: RFValue(4)}}>
//               <ThemedText type="Body3" style={{color: Colors.light.blackSecondary}}>
//                 |
//               </ThemedText>
//               <SearchIcon size={RFValue(12)} color={ reviewer ? StatusColors.inReview : Colors.light.blackSecondary} />
//               <ThemedText type="Body3" style={{color: reviewer ? StatusColors.inReview : Colors.light.blackSecondary}}>
//                 {/* {reviewer ? `${reviewer[0].first_name}` : "Not Assigned"} */}
//                 { reviewer && reviewer.length > 0
//                     ? `${formatDisplayName(reviewer[0].first_name)}` 
//                     : "Not Assigned"
//                 }
//               </ThemedText>
//             </View>
//           )}
//         </View>
//       </ThemedView>
//       <ThemedView style={styles.rightSection}>
//         {showNudgeButton ? (
//           <ThemedTouchableView onPress={handleNudge} style={{ marginLeft: RFValue(8), backgroundColor: 'transparent' }}>
//             <BellIcon size={RFValue(24)} color={Colors.light.blackSecondary} />
//           </ThemedTouchableView>
//         ) : (
//           <View style={{ height: RFValue(24) }} />
//         )}
//         <StatusDropdown 
//           value={status}
//           onValueChange={handleStatusUpdate}
//         />
//       </ThemedView>
//     </ThemedTouchableView>
//   );
// }

// const styles = StyleSheet.create({
//   taskCard: {
//     padding: RFValue(16),
//     borderRadius: RFValue(8),
//     borderWidth: RFValue(0.3),
//     borderColor: Colors.light.cardBorder,
//     backgroundColor: Colors.light.card,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   leftSection: {
//     backgroundColor: Colors.light.card,
//     flexDirection: 'column',
//     gap: RFValue(4),
//   },
//   rightSection: {
//     backgroundColor: Colors.light.card,
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//   }
// });

import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import {
  BellIcon,
  FlagIcon,
  SearchIcon,
  UserCircleIcon
} from '@/components/icons';

import {
  StatusDropdown,
  ThemedText,
  ThemedTouchableView,
  ThemedView
} from '@/components/ui';

import { Colors, StatusColors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import { useNudgeAlert } from '@/contexts/nudge-context';

import { formatDate } from '@/utils/date-formatter';
import { formatDisplayName } from '@/utils/name-formatter';

import { TaskCardProps } from '@/types/task';



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
  const { uid, groups } = useAuthStore();
  const gid = groups[0];
  const { showNudgeAlert } = useNudgeAlert();

  const [showNudgeButton, setShowNudgeButton] = useState(false);

  const formattedDeadline = formatDate(deadline);
  const MAX_TITLE_LENGTH = 23;

  const truncatedTitle =
    title.length > MAX_TITLE_LENGTH
      ? title.substring(0, MAX_TITLE_LENGTH) + '...'
      : title;

  const handlePress = () => {
    router.push({
      pathname: '/task-detail',
      params: { tid: id }
    });
  };

  const handleNudge = () => {
    const shouldNudgeReviewer =
      status === 'In Review' && reviewer && reviewer.length > 0;

    const targetUser = shouldNudgeReviewer
      ? reviewer[0]
      : assignedTo;

    showNudgeAlert(id, title, targetUser, nudgeCount, onNudgeSent);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await axios.patch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/tasks/${gid}/${id}`,
        { status: newStatus }
      );

      onStatusChange(newStatus);

    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  useEffect(() => {
    const isInReview = status === 'In Review';

    if (isInReview && reviewer?.length > 0) {
      setShowNudgeButton(uid !== reviewer[0]._id);
    } else {
      setShowNudgeButton(uid !== assignedTo._id);
    }
  }, [uid, assignedTo, reviewer, status]);


  return (
    <ThemedTouchableView style={styles.taskCard} onPress={handlePress}>
      
      {/* LEFT SECTION */}
      <ThemedView style={styles.leftSection}>

        {/* Title & Flag Section */}
        <View style={styles.titleRow}>
          <ThemedText type="H3">
            {nudgeCount >= 3 ? truncatedTitle : title}
          </ThemedText>

          {nudgeCount > 0 && (
            <View style={styles.flagRow}>
              <FlagIcon
                size={RFValue(18)}
                color={Colors.light.red}
                strokeWidth={RFValue(2)}
              />
              <ThemedText type="Body3" style={styles.flagCountText}>
                {nudgeCount}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Deadline */}
        <ThemedText type="Body3" style={styles.deadlineText}>
          {formattedDeadline}
        </ThemedText>

        {/* Assignee + Reviewer Section */}
        <View style={styles.userRow}>
          <UserCircleIcon size={RFValue(12)} color={Colors.light.tint} />
          <ThemedText type="Body3" style={styles.assigneeText}>
            {formatDisplayName(assignedTo.first_name)}
          </ThemedText>

          {status !== 'To-Do' && (
            <View style={styles.reviewerRow}>
              <ThemedText type="Body3" style={styles.separatorText}>|</ThemedText>

              <SearchIcon
                size={RFValue(12)}
                color={reviewer ? StatusColors.inReview : Colors.light.blackSecondary}
              />

              <ThemedText
                type="Body3"
                style={[
                  styles.reviewerName,
                  { color: reviewer ? StatusColors.inReview : Colors.light.blackSecondary }
                ]}
              >
                {reviewer?.length
                  ? formatDisplayName(reviewer[0].first_name)
                  : 'Not Assigned'}
              </ThemedText>
            </View>
          )}
        </View>

      </ThemedView>

      {/* RIGHT SECTION */}
      <ThemedView style={styles.rightSection}>
        {showNudgeButton ? (
          <ThemedTouchableView onPress={handleNudge} style={styles.nudgeButton}>
            <BellIcon size={RFValue(24)} color={Colors.light.blackSecondary} />
          </ThemedTouchableView>
        ) : (
          <View style={styles.placeholderIcon} />
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
  /** CARD */
  taskCard: {
    padding: RFValue(16),
    borderRadius: RFValue(8),
    borderWidth: RFValue(0.3),
    borderColor: Colors.light.cardBorder,
    backgroundColor: Colors.light.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  /** LEFT SECTION */
  leftSection: {
    backgroundColor: Colors.light.card,
    flexDirection: 'column',
    gap: RFValue(4),
  },

  /** Title Row */
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RFValue(8),
  },

  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RFValue(4),
  },

  flagCountText: {
    color: Colors.light.red,
  },

  deadlineText: {
    color: Colors.light.blackSecondary,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RFValue(4),
  },

  assigneeText: {
    color: Colors.light.tint,
  },

  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RFValue(4),
  },

  separatorText: {
    color: Colors.light.blackSecondary,
  },

  reviewerName: {
    // color applied dynamically
  },

  /** RIGHT SECTION */
  rightSection: {
    backgroundColor: Colors.light.card,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  nudgeButton: {
    marginLeft: RFValue(8),
    backgroundColor: 'transparent',
  },

  placeholderIcon: {
    height: RFValue(24),
  },
});