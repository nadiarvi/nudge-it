import { BackIcon } from '@/components/icons';
import { ParallaxScrollView, ThemedButton, ThemedText, ThemedTextInput, ThemedTouchableView, ThemedView } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function RegisterGroupScreen() {
  const router = useRouter();
  const { first_name, uid, email, last_name, signIn, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [loading, setLoading] = useState(false);

  // Create group states
  const [groupName, setGroupName] = useState('');
  const [taEmail, setTaEmail] = useState('');
  const [nudgeLimit, setNudgeLimit] = useState('1');

  // Join group states
  const [inviteCode, setInviteCode] = useState('');
  const INVITE_CODE_LENGTH = 6;   

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Missing Information", "Please enter a group name.");
      return;
    }

    setLoading(true);

    const payload = {
        name: groupName.trim(),
        ta_email: taEmail.trim() || undefined,
        nudge_limit: parseInt(nudgeLimit) || undefined,
    }
    console.log("Creating group with payload:", payload);

    try {
      console.log('creating group for user:', uid);
      const res = await axios.post(`${API_BASE_URL}/api/groups/create/${uid}`, payload);
      const groupId = res.data.groupId;
    
      await signIn({
        uid,
        first_name,
        last_name,
        email,
        groups: [groupId],
      });

      router.replace('/(tabs)');
      
    } catch (error: any) {
      console.error("Group creation failed:", error.response?.data || error.message);
      console.log("failed req: ", `${API_BASE_URL}/api/groups/create/${uid}`, payload);
      Alert.alert("Error", error.response?.data?.message || "Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!inviteCode.trim() || inviteCode.trim().length !== INVITE_CODE_LENGTH) {
      Alert.alert("Invalid Code", `Please enter a valid ${INVITE_CODE_LENGTH}-digit invite code.`);
      return;
    }

    setLoading(true);

    try {
      const payload = { inviteCode}
      console.assert(uid, "User ID is required to join a group");
      const res = await axios.patch(`${API_BASE_URL}/api/groups/${uid}/join`, payload);
      const gid = res.data.group._id;

      // Update the auth context with the joined group
      await signIn({
        uid,
        first_name,
        last_name,
        email,
        groups: [gid],
      });

      Alert.alert("Success", "Successfully joined the group!");
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error("Join group failed:", error.response?.data || error.message);
      console.error("failed req: ", `${API_BASE_URL}/api/groups/${uid}/join`, { inviteCode });
      Alert.alert("Error", error.response?.data?.message || "Failed to join group. Please check the invite code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchTab = (tab: 'create' | 'join') => {
    // reset all fields
    setGroupName('');
    setTaEmail('');
    setNudgeLimit('1');
    setInviteCode('');
    setActiveTab(tab);
  };

  const handleBackNav = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <ParallaxScrollView>
        <ThemedTouchableView onPress={handleBackNav} style={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            <BackIcon size={16} strokeWidth={3} color={Colors.light.tint} />
            <ThemedText style={styles.backNavTitle} type="Body2">
                Sign Up
            </ThemedText>

        </ThemedTouchableView>
        <ThemedView style={{ flexDirection: 'column', gap: 16, marginTop: 32,}}>
            <View style={{ alignItems: 'center', marginBottom: 32, gap: 16 }}>
                <ThemedText type="H1" style={styles.title}>
                    Join a Group
                </ThemedText>
                <ThemedText type="Body1" style={styles.subtitle}>
                    Make a new group or join an existing one to get started!
                </ThemedText>
            </View>
        
            {/* Tab Selector */}
            <ThemedView style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'create' && styles.activeTab]}
                    onPress={() => handleSwitchTab('create')}
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
                onPress={() => handleSwitchTab('join')}
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
                    Nudge Threshold per Stage
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
                    Enter the {INVITE_CODE_LENGTH}-digit code from your group
                </ThemedText>
                <ThemedTextInput
                    style={[styles.input, styles.codeInput]}
                    placeholder="000000"
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    maxLength={INVITE_CODE_LENGTH}
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
    },
    backNavTitle: {
        color: Colors.light.tint, 
        fontWeight: '600',
        fontSize: 16,
    },
    subtitle: {
        textAlign: 'center',
        color: Colors.light.blackSecondary,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.light.card,
        borderRadius: 8,
        padding: 4,
        borderWidth: 0.5,
        borderColor: Colors.light.cardBorder,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: Colors.light.cardBorder,
    },
    tabText: {
        color: Colors.light.blackSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: Colors.light.text,
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
        paddingVertical: 20,
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