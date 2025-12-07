import { TaskDetailHeader, ThemedText, ThemedView } from '@/components/ui';
import AuthStore, { useAuthStore } from '@/contexts/auth-context';
import { NudgeProvider } from '@/contexts/nudge-context';
import notificationService from '@/services/notificationService';
import { registerPushToken } from '@/services/userService';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { router, Stack, useSegments } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import { RFValue } from 'react-native-responsive-fontsize';

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  return (
    <AuthStore>
      <KeyboardProvider>
        <RootNavigation />
      </KeyboardProvider>
    </AuthStore>
  );
}

function RootNavigation() {
  const { isSignIn, isLoading, groups, uid } = useAuthStore();
  const segments = useSegments();
  
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const routes = ['login', 'register-group'];
  const currSegment = segments[0];
  const inAuthOrOnboardingGroup = routes.includes(currSegment);

  const hasGroup = groups && groups.length > 0;

  // Initialize notifications when user logs in
  useEffect(() => {
    if (isSignIn && uid) {
      console.log('🔔 Setting up notifications for user:', uid);
      
      // Register for push notifications and save token to backend
      registerPushToken(uid);

      // Listen for notifications received while app is in foreground
      notificationListener.current = notificationService.addNotificationReceivedListener(
        (notification) => {
          console.log('📬 Notification received:', notification);
          // Notification will show automatically based on the handler configuration
        }
      );

      // Listen for when user taps on notification
      responseListener.current = notificationService.addNotificationResponseReceivedListener(
        (response) => {
          console.log('👆 Notification tapped:', response);
          
          // Navigate based on notification data
          const data = response.notification.request.content.data;
          
          // Handle navigation based on notification type
          if (data?.screen === '/task-detail' && data?.taskId) {
            router.push({
              pathname: '/task-detail',
              params: { id: data.taskId }
            });
          } else if (data?.screen) {
            router.push(data.screen as any);
          }
        }
      );

      // Cleanup listeners
      return () => {
        if (notificationListener.current) {
          notificationService.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
          notificationService.removeNotificationSubscription(responseListener.current);
        }
      };
    }
  }, [isSignIn, uid]);

  // Navigation logic
  useEffect(() => {
    if (!isLoading) {
      if (!isSignIn && !inAuthOrOnboardingGroup) {
        console.log('Redirecting to login - user not signed in');
        router.replace('/login');
      }
      else if (isSignIn && !hasGroup && currSegment !== 'register-group') {
        router.replace('/register-group');
      }
      else if (isSignIn && hasGroup && inAuthOrOnboardingGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [isSignIn, inAuthOrOnboardingGroup, isLoading, currSegment, groups, hasGroup]);

  if (isLoading) {
    return (
      <ThemedView style={{ flex: RFValue(1), justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }
  
  return (
    <ThemeProvider value={DefaultTheme}>
      <NudgeProvider>
        <Stack>
          <Stack.Screen 
            name="login" 
            options={{ 
              headerShown: false,
            }} 
          />
          
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen 
            name="task-detail" 
            options={{ 
              headerShown: true,
              title: '',
              headerBackTitle: '',
              headerRight: () => <TaskDetailHeader />,
              gestureEnabled: false,
            }} 
          />
          <Stack.Screen 
            name="register-group" 
            options={{ 
              headerTitle: 'Register Your Group',
              headerShown: false,
            }} 
          />
        </Stack>
      </NudgeProvider>
    </ThemeProvider>
  );
}