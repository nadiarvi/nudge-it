import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { TaskDetailHeader } from '@/components/ui/task-detail-header';
import { NudgeProvider } from '@/contexts/nudge-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <NudgeProvider>
        <Stack>
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
