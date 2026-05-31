import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { OW, TQFonts } from '@/constants/owner-design';

function OwnerTabIcon({
  focused,
  color,
  size,
  children,
}: {
  focused: boolean;
  color: string;
  size: number;
  children: React.ReactNode;
}) {
  return (
    <View style={[tabIconStyles.wrap, focused && tabIconStyles.wrapActive]}>
      {children}
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 32,
    borderRadius: 10,
  },
  wrapActive: {
    backgroundColor: OW.yellowSoft,
  },
});

export default function OwnerTabLayout() {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: OW.yellowDeep,
        tabBarInactiveTintColor: OW.gray500,
        tabBarLabelStyle: { fontFamily: TQFonts.medium, fontSize: 11 },
        tabBarStyle: {
          height: 58 + bottom,
          paddingTop: 6,
          paddingBottom: bottom,
          backgroundColor: OW.white,
          borderTopColor: OW.gray200,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <OwnerTabIcon focused={focused} color={color} size={size}>
              <Feather name="home" size={size} color={focused ? OW.yellowDeep : color} />
            </OwnerTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          tabBarIcon: ({ color, size, focused }) => (
            <OwnerTabIcon focused={focused} color={color} size={size}>
              <Feather name="navigation" size={size} color={focused ? OW.yellowDeep : color} />
            </OwnerTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="loads"
        options={{
          title: 'Loads',
          tabBarIcon: ({ color, size, focused }) => (
            <OwnerTabIcon focused={focused} color={color} size={size}>
              <MaterialCommunityIcons
                name="truck-cargo-container"
                size={size}
                color={focused ? OW.yellowDeep : color}
              />
            </OwnerTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size, focused }) => (
            <OwnerTabIcon focused={focused} color={color} size={size}>
              <Feather name="message-circle" size={size} color={focused ? OW.yellowDeep : color} />
            </OwnerTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size, focused }) => (
            <OwnerTabIcon focused={focused} color={color} size={size}>
              <Feather name="clock" size={size} color={focused ? OW.yellowDeep : color} />
            </OwnerTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <OwnerTabIcon focused={focused} color={color} size={size}>
              <Feather name="user" size={size} color={focused ? OW.yellowDeep : color} />
            </OwnerTabIcon>
          ),
        }}
      />
    </Tabs>
  );
}
