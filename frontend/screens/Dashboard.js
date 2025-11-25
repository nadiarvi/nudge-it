import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/parallax-scroll-view";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#F9FAFB", dark: "#1a1a1a" }}
      headerImage={null}
    >
      <ScrollView style={styles.container}>
        {/* ----- Title Row ----- */}
        <View style={styles.headerRow}>
          <ThemedText type="title">Dashboard</ThemedText>

          <View style={styles.courseTag}>
            <Text style={styles.courseText}>CS473 Social Computing</Text>
          </View>
        </View>

        {/* ----- Summary Cards ----- */}
        <View style={styles.summaryRow}>
          <SummaryCard label="Nudges Sent" value={3} />
          <SummaryCard label="Nudges Received" value={3} />
        </View>

        {/* ----- To-do ----- */}
        <SectionHeader title="To-do" />
        <TaskCard
          title="Design the Dashboard"
          due="Fri, 24 Oct 2025"
          assigned="You"
          status="To Do"
        />

        {/* ----- To-review ----- */}
        <SectionHeader title="To-review" />
        <TaskCard
          title="Design the Chatbox"
          due="Fri, 24 Oct 2025"
          assigned="Yong Lin"
          reviewerNeeded
          status="In Review"
        />

        {/* ----- Pending for Review ----- */}
        <SectionHeader title="Pending for Review" />
        <View style={styles.emptyCard}>
          <Text style={{ color: "#777" }}>No items need review</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ParallaxScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/*                             SummaryCard Component                           */
/* -------------------------------------------------------------------------- */

function SummaryCard({ label, value }) {
  return (
    <View style={styles.summaryCard}>
      <Ionicons name="warning-outline" size={20} color="#333" />
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Section Header                                 */
/* -------------------------------------------------------------------------- */

function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLeft}>
        <Ionicons name="list-outline" size={18} color="#333" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#333" />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                TaskCard                                     */
/* -------------------------------------------------------------------------- */

function TaskCard({ title, due, assigned, status, reviewerNeeded }) {
  return (
    <View style={styles.taskCard}>
      {/* Title */}
      <Text style={styles.taskTitle}>{title}</Text>

      {/* Due + Assigned */}
      <View style={styles.taskMeta}>
        <Ionicons name="calendar-outline" size={16} color="#555" />
        <Text style={styles.taskMetaText}>{due}</Text>
      </View>

      <View style={styles.taskMeta}>
        <Ionicons name="person-circle-outline" size={16} color="#555" />
        <Text style={styles.taskMetaText}>{assigned}</Text>

        {reviewerNeeded && (
          <View style={styles.reviewerTag}>
            <Text style={styles.reviewerText}>Need Reviewer</Text>
          </View>
        )}
      </View>

      {/* Status badge */}
      <StatusBadge status={status} />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Status Badge                                  */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }) {
  const colorMap = {
    "To Do": { bg: "#fee2e2", text: "#b91c1c" },
    "In Review": { bg: "#fef3c7", text: "#b45309" },
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: colorMap[status].bg }]}>
      <Text style={[styles.statusBadgeText, { color: colorMap[status].text }]}>
        {status}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Styles                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  courseTag: {
    backgroundColor: "#E0EAFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  courseText: {
    color: "#1E40AF",
    fontWeight: "500",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  summaryCard: {
    width: "48%",
    backgroundColor: "#F5F7FA",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  summaryLabel: {
    marginTop: 8,
    color: "#555",
  },
  summaryValue: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: "bold",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 10,
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  taskCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    marginBottom: 16,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  taskMetaText: { color: "#555" },

  reviewerTag: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 6,
  },
  reviewerText: {
    color: "#b45309",
    fontSize: 12,
    fontWeight: "500",
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
  },
  statusBadgeText: { fontWeight: "600" },

  emptyCard: {
    backgroundColor: "#fafafa",
    padding: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    marginBottom: 20,
  },
});
