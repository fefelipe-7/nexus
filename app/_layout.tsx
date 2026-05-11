import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@/components/common/ThemeProvider';
import { spacing } from '@/design/spacing';

export default function Layout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: spacing.sm,
        },
        tabBarActiveTintColor: theme.colors.accent?.violet || '#8B5CF6',
        tabBarInactiveTintColor: theme.colors.text.tertiary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vida"
        options={{
          title: 'Vida',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mente"
        options={{
          title: 'Mente',
          tabBarIcon: ({ color }) => <FontAwesome5 name="brain" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saude"
        options={{
          title: 'Saúde',
          tabBarIcon: ({ color }) => <FontAwesome5 name="heartbeat" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="acao"
        options={{
          title: 'Ação',
          tabBarIcon: ({ color }) => <FontAwesome5 name="rocket" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="financa"
        options={{
          title: 'Finança',
          tabBarIcon: ({ color }) => <FontAwesome5 name="coins" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <FontAwesome5 name="cog" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
