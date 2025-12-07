import { EyeIcon, EyeSlashIcon } from '@/components/icons';
import { ThemedButton, ThemedText, ThemedTextInput, ThemedView } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/contexts/auth-context';
import axios from "axios";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleLogin = async () => {
    console.log("Attempting login with:", { email: loginEmail });
    console.log('HELLOOOO PLS WORK IM BEGGING');

    console.log("API URL FROM APK:", process.env.EXPO_PUBLIC_API_BASE_URL);

    setIsLoading(true);

    try {
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      const data = res.data.existingUser;
      console.log('Login BE success');
      console.log(data);

      await signIn({
        uid: data._id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        groups: data.groups,
      });
    } catch (error: any) {
      Alert.alert("Login Error", "Invalid email or password. Please try again.");
      console.error("Login failed:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !signUpEmail || !signUpPassword) {
      Alert.alert("Missing information", "Please fill out all fields to sign up.");
      return;
    }

    if (signUpPassword.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/signup`, {
        first_name: firstName,
        last_name: lastName,
        email: signUpEmail,
        password: signUpPassword,
      });
      const data = res.data.user;
      console.log("Sign up BE success");
      console.log(data);
      await signIn({
        uid: data._id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        groups: data.groups,
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert("Sign Up Error", error.response.data.message);
      }

      console.error("Sign Up failed:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.content}>
          <ThemedView style={styles.header}>
            <ThemedText type="H1" style={styles.title}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </ThemedText>
            <ThemedText type="Body1" style={styles.subtitle}>
              {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
            </ThemedText>
          </ThemedView>

          {!isSignUp ? (
            <ThemedView style={styles.form}>
              <ThemedView style={styles.inputContainer}>
                <ThemedText type="Body2" style={styles.label}>
                  Email
                </ThemedText>
                <ThemedTextInput
                  style={styles.input}
                  // placeholder="Enter your email"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </ThemedView>

              <ThemedView style={styles.inputContainer}>
                <ThemedText type="Body2" style={styles.label}>
                  Password
                </ThemedText>
                <ThemedView style={styles.passwordContainer}>
                  <ThemedTextInput
                    style={styles.passwordInput}
                    // placeholder="Enter your password"
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    secureTextEntry={!showLoginPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowLoginPassword(!showLoginPassword)}
                    disabled={isLoading}
                  >
                    {showLoginPassword ? <EyeIcon size={20} color={Colors.light.blackSecondary} /> : <EyeSlashIcon size={20} color={Colors.light.blackSecondary} />}
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>

              <ThemedButton 
                variant="primary" 
                onPress={handleLogin}
                style={styles.submitButton}
              >
                Log In
              </ThemedButton>
            </ThemedView>
          ) : (
            // Sign Up Form
            <ThemedView style={styles.form}>
              <ThemedView style={styles.inputContainer}>
                <ThemedText type="Body2" style={styles.label}>
                  First Name
                </ThemedText>
                <ThemedTextInput
                  style={styles.input}
                  placeholder="Enter your first name"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </ThemedView>

              <ThemedView style={styles.inputContainer}>
                <ThemedText type="Body2" style={styles.label}>
                  Last Name
                </ThemedText>
                <ThemedTextInput
                  style={styles.input}
                  placeholder="Enter your last name"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </ThemedView>

              <ThemedView style={styles.inputContainer}>
                <ThemedText type="Body2" style={styles.label}>
                  Email
                </ThemedText>
                <ThemedTextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={signUpEmail}
                  onChangeText={setSignUpEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </ThemedView>

              <ThemedView style={styles.inputContainer}>
                <ThemedText type="Body2" style={styles.label}>
                  Password
                </ThemedText>
                <ThemedView style={styles.passwordContainer}>
                  <ThemedTextInput
                    style={styles.passwordInput}
                    placeholder="Create a password"
                    value={signUpPassword}
                    onChangeText={setSignUpPassword}
                    secureTextEntry={!showSignUpPassword}
                    autoCapitalize="none"
                    disabled={isLoading}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowSignUpPassword(!showSignUpPassword)}
                    disabled={isLoading}
                  >
                    {showSignUpPassword ? <EyeIcon size={20} color={Colors.light.blackSecondary} /> : <EyeSlashIcon size={20} color={Colors.light.blackSecondary} />}
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>

              <ThemedButton 
                variant="primary" 
                onPress={handleSignUp}
                style={styles.submitButton}
                disabled={isLoading}
              >
                Sign Up
              </ThemedButton>
            </ThemedView>
          )}

          <ThemedView style={styles.switchContainer}>
            <ThemedText type="Body2" style={styles.switchText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </ThemedText>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <ThemedText type="Body2" style={styles.switchButton}>
                {isSignUp ? 'Log In' : 'Sign Up'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: RFValue(24),
    paddingVertical: RFValue(40),
    justifyContent: 'center',
  },
  header: {
    marginBottom: RFValue(40),
    alignItems: 'center',
  },
  title: {
    marginBottom: RFValue(8),
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.light.blackSecondary,
    textAlign: 'center',
  },
  form: {
    gap: RFValue(20),
  },
  inputContainer: {
    gap: RFValue(8),
  },
  label: {
    fontWeight: '600',
    color: Colors.light.text,
  },
  input: {
    borderWidth: RFValue(1),
    borderColor: Colors.light.cardBorder,
    borderRadius: RFValue(8),
    backgroundColor: Colors.light.card,
    paddingHorizontal: RFValue(16),
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: RFValue(1),
    borderColor: Colors.light.cardBorder,
    borderRadius: RFValue(8),
    backgroundColor: Colors.light.card,
    paddingHorizontal: RFValue(16),
    paddingRight: RFValue(48),
  },
  eyeIcon: {
    position: 'absolute',
    right: RFValue(16),
    padding: RFValue(4),
  },
  submitButton: {
    marginTop: RFValue(12),
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(32),
    gap: RFValue(4),
  },
  switchText: {
    color: Colors.light.blackSecondary,
  },
  switchButton: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
});
