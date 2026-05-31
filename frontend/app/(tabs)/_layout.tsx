import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { TabBarIcon } from '@/components/truckq/TabBarIcon';
import { TQ, TQFonts } from '@/constants/truckq-design';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: TQ.yellowDeep,
        tabBarInactiveTintColor: TQ.gray400,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: TQFonts.medium,
          fontSize: 11,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarStyle: {
          height: 58 + bottomPad,
          paddingTop: 6,
          paddingBottom: bottomPad,
          backgroundColor: TQ.white,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: TQ.gray200,
          elevation: 12,
          shadowColor: TQ.black,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name="home" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name="navigation" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name="message-circle" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name="clock" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name="inbox" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name="user" color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
