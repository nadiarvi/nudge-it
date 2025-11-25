import { ThemedButton, ThemedText, ThemedTextInput, ThemedView } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

export default function RegisterGroupScreen() {
  const router = useRouter();
  const { first_name, uid, email, last_name, signIn } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [loading, setLoading] = useState(false);

  // Create group states
  const [groupName, setGroupName] = useState('');
  const [taEmail, setTaEmail] = useState('');
  const [nudgeLimit, setNudgeLimit] = useState('1');

  // Join group states
  const [inviteCode, setInviteCode] = useState('');

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Missing Information", "Please enter a group name.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/groups/create`, {
        name: groupName.trim(),
        members: [uid],
        ta_email: taEmail.trim() || undefined,
        nudge_limit: parseInt(nudgeLimit) || 1,
      });

      const groupId = res.data.group._id;

      // Update the auth context with the new group
      await signIn({
        uid,
        first_name,
        last_name,
        email,
        groups: [groupId],
      });

      Alert.alert("Success", `Group "${groupName}" created successfully!`);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error("Group creation failed:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    // TODO: ENTER A GROUP WITH 4 DIGIT INVITATION CODE
    if (!inviteCode.trim() || inviteCode.trim().length !== 4) {
      Alert.alert("Invalid Code", "Please enter a valid 4-digit invite code.");
      return;
    }

    setLoading(true);

    try {
      // Use the invite code as the group ID
      const groupId = inviteCode.trim();

      const res = await axios.patch(`${API_BASE_URL}/api/groups/${groupId}/members`, {
        userIds: [uid],
      });

      // Update the auth context with the joined group
      await signIn({
        uid,
        first_name,
        last_name,
        email,
        groups: [groupId],
      });

      Alert.alert("Success", "Successfully joined the group!");
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error("Join group failed:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to join group. Please check the invite code and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="H2" style={styles.title}>
        Welcome, {first_name}!
      </ThemedText>
      <ThemedText type="Body1" style={styles.subtitle}>
        Let's get you set up with an accountability group.
      </ThemedText>

      {/* Tab Selector */}
      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}
        >
          <ThemedText
            type="Body2"
            style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}
          >
            Create Group
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'join' && styles.activeTab]}
          onPress={() => setActiveTab('join')}
        >
          <ThemedText
            type="Body2"
            style={[styles.tabText, activeTab === 'join' && styles.activeTabText]}
          >
            Join Group
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Tab Content */}
      {activeTab === 'create' ? (
        <ThemedView style={styles.content}>
          <ThemedView style={styles.form}>
            <ThemedView style={styles.inputContainer}>
              <ThemedText type="Body2" style={styles.label}>
                Group Name
              </ThemedText>
              <ThemedTextInput
                style={styles.input}
                value={groupName}
                onChangeText={setGroupName}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText type="Body2" style={styles.label}>
                TA Email (Optional)
              </ThemedText>
              <ThemedTextInput
                style={styles.input}
                placeholder="ta@email.com"
                value={taEmail}
                onChangeText={setTaEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText type="Body2" style={styles.label}>
                Daily Nudge Limit
              </ThemedText>
              <ThemedTextInput
                style={styles.input}
                placeholder="1"
                value={nudgeLimit}
                onChangeText={setNudgeLimit}
                keyboardType="number-pad"
              />
            </ThemedView>
          </ThemedView>

          <ThemedButton 
            variant="primary" 
            onPress={handleCreateGroup}
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Creating Group...' : 'Create Group'}
          </ThemedButton>
        </ThemedView>
      ) : (
        <ThemedView style={styles.content}>
          <ThemedView style={styles.form}>
            <ThemedView style={styles.inputContainer}>
              <ThemedText type="Body2" style={styles.label}>
                Invite Code
              </ThemedText>
              <ThemedText type="Body2" style={styles.helperText}>
                Enter the 4-digit code from your group
              </ThemedText>
              <ThemedTextInput
                style={[styles.input, styles.codeInput]}
                placeholder="0000"
                value={inviteCode}
                onChangeText={setInviteCode}
                keyboardType="number-pad"
                maxLength={4}
              />
            </ThemedView>
          </ThemedView>

          <ThemedButton 
            variant="primary" 
            onPress={handleJoinGroup}
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Joining Group...' : 'Join Group'}
          </ThemedButton>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: Colors.light.blackSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    padding: 4,
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.light.tint,
  },
  tabText: {
    color: Colors.light.blackSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.light.background,
  },
  content: {
    flex: 1,
  },
  form: {
    gap: 20,
    marginBottom: 30,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontWeight: '600',
    color: Colors.light.text,
  },
  helperText: {
    color: Colors.light.blackSecondary,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
  },
  codeInput: {
    fontSize: 28,
    textAlign: 'center',
    letterSpacing: 12,
    fontWeight: '600',
  },
  button: {
    marginTop: 12,
  }
});