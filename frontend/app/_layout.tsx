import { TaskDetailHeader, ThemedView } from '@/components/ui';
// import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { ThemedText } from '@/components/ui';
import AuthStore, { useAuthStore } from '@/contexts/auth-context';
import { NudgeProvider } from '@/contexts/nudge-context';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  initialRouteName: 'login',
};

function RootLayoutContent() {
  const { isSignIn, isLoading, uid } = useAuthStore();
  console.log('RootLayout - isSignIn:', isSignIn, 'isLoading:', isLoading, 'uid:', uid);
  
  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
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
        </Stack>
        <StatusBar style="auto" />
      </NudgeProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthStore>
      {/* <RootLayoutContent /> */}
      <RootNavigation />
    </AuthStore>
  );
}

function RootNavigation() {
  const { isSignIn, isLoading } = useAuthStore();
  const segments = useSegments();

  const inAuthGroup = segments[0] === 'login';

  useEffect(() => {
    if (!isLoading) {
      if (!isSignIn && !inAuthGroup) {
        router.replace('/login');
      } 
      else if (isSignIn && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [isSignIn, inAuthGroup, isLoading]);

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
    </Stack>
    </NudgeProvider>
    </ThemeProvider>
  );
}
