import { TaskDetailHeader, ThemedView } from '@/components/ui';
// import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { ThemedText } from '@/components/ui';
import AuthStore, { useAuthStore } from '@/contexts/auth-context';
import { NudgeProvider } from '@/contexts/nudge-context';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  return (
    <AuthStore>
      {/* <RootLayoutContent /> */}
      <RootNavigation />
    </AuthStore>
  );
}

function RootNavigation() {
  const { isSignIn, isLoading, groups } = useAuthStore();
  const segments = useSegments();

  const routes = ['login', 'register-group'];
  const currSegment = segments[0];
  const inAuthOrOnboardingGroup = routes.includes(currSegment);

  const hasGroup = groups && groups.length > 0;

  // const inAuthGroup = segments[0] === 'login';

  useEffect(() => {
    if (!isLoading) {
      // Case 1: User is not signed in
      if (!isSignIn && !inAuthOrOnboardingGroup) {
        console.log('Redirecting to login - user not signed in');
        router.replace('/login');
      }
      // Case 2: User is signed in but has no groups
      else if (isSignIn && !hasGroup && currSegment !== 'register-group') {
        router.replace('/register-group');
      }
      // Case 3: User is signed in, has groups, but still on login page
      else if (isSignIn && hasGroup && currSegment === 'login') {
        router.replace('/(tabs)');
      }
    }
  }, [isSignIn, inAuthOrOnboardingGroup, isLoading, currSegment, groups]);

  if (isLoading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
