import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AUTH } from '@/components/truckq/auth/auth-theme';
import { TQFonts } from '@/constants/truckq-design';
import type { UserRole } from '@/lib/owner-types';

export function AuthRoleBadge({ role }: { role: UserRole }) {
  const isDriver = role === 'driver';
  return (
    <TouchableOpacity
      style={styles.badge}
      onPress={() => router.replace('/choose-role')}
      activeOpacity={0.85}
    >
      <MaterialCommunityIcons
        name={isDriver ? 'truck-outline' : 'package-variant'}
        size={18}
        color={AUTH.black}
      />
      <Text style={styles.text}>
        {isDriver ? 'Truck Owner' : 'Cargo Owner'} · Change role
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: AUTH.yellowLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AUTH.yellow,
  },
  text: {
    fontFamily: TQFonts.semiBold,
    fontSize: 13,
    color: AUTH.black,
  },
});
