import { Tabs } from 'expo-router';
import React from 'react';
import { PaperProvider, useTheme } from 'react-native-paper';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <PaperProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.background,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: '会話練習',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bunnpou"
          options={{
            title: '文法',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'extension-puzzle' : 'extension-puzzle-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="choukai"
          options={{
            title: '聴解',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'headset' : 'headset-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="secchi"
          options={{
            title: '設置',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
