import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { darkTheme } from '@design/theme';
import { spacing } from '@design/spacing';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: darkTheme.colors.surface,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: spacing.sm,
        },
        tabBarActiveTintColor: darkTheme.colors.accent.violet,
        tabBarInactiveTintColor: darkTheme.colors.neutral[500],
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
    </Tabs>
  );
}