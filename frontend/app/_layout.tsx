import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { TaskDetailHeader } from '@/components/ui/task-detail-header';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { NudgeProvider } from '@/contexts/nudge-context';

export const unstable_settings = {
  initialRouteName: 'login',
};

function RootLayoutContent() {
  const { user } = useAuth();

  useEffect(() => {
    // Debug: Log current user info on app load
    console.log('[App Entry Point] Current User Email:', user?.email || 'Not logged in');
  }, [user]);

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
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
