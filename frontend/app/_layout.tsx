import { TaskDetailHeader } from '@/components/ui';
// import { AuthProvider, useAuth } from '@/contexts/auth-context';
import AuthStore from '@/contexts/auth-context';
import { NudgeProvider } from '@/contexts/nudge-context';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  initialRouteName: 'login',
};

function RootLayoutContent() {
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
      <RootLayoutContent />
    </AuthStore>
  );
}
