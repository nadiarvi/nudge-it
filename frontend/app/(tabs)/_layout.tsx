import { Tabs } from 'expo-router';
import React from 'react';

import { ChatIcon } from '@/components/icons/chat-icon';
import { HomeIcon } from '@/components/icons/home-icon';
import { TodoIcon } from '@/components/icons/todo-icon';
import { UserIcon } from '@/components/icons/user-icon';
import { HapticTab } from '@/components/ui/haptic-tab';
import { Colors } from '@/constants/theme';

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
          tabBarIcon: ({ color, focused }) => <HomeIcon size={22} color={color} variant={ focused ? 'solid' : 'outline' } />,
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused }) => <TodoIcon size={22} color={color} variant={focused ? 'solid' : 'outline'} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => <ChatIcon size={22} color={color} variant={focused ? 'solid' : 'outline'} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <UserIcon size={22} color={color} variant={focused ? 'solid' : 'outline'} />,
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
