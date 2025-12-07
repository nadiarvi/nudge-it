import { Tabs } from 'expo-router';
import React from 'react';

import { ChatIcon, HomeIcon, TodoIcon, UserIcon } from '@/components/icons';
import { HapticTab } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { RFValue } from 'react-native-responsive-fontsize';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <HomeIcon size={RFValue(22)} color={color} variant={ focused ? 'solid' : 'outline' } />, 
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused }) => <TodoIcon size={RFValue(22)} color={color} variant={focused ? 'solid' : 'outline'} />, 
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => <ChatIcon size={RFValue(22)} color={color} variant={focused ? 'solid' : 'outline'} />, 
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <UserIcon size={RFValue(22)} color={color} variant={focused ? 'solid' : 'outline'} />, 
        }}
      />
      <Tabs.Screen
        name="task-detail"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
