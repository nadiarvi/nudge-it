import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import 'react-native-reanimated';

import { MenuIcon } from '@/components/icons/menu-icon';
import { Colors } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen 
          name="task-detail" 
          options={{ 
            headerShown: true,
            title: '',
            headerBackTitle: '',
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => {
                  console.log('Menu pressed');
                }}
              >
                <MenuIcon size={24} color={Colors.light.tint} />
              </TouchableOpacity>
            ),
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
