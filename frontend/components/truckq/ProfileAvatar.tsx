import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { TQ, TQFonts } from '@/constants/truckq-design';

type Props = {
  uri?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
  borderColor?: string;
  showInitials?: boolean;
};

function initialsFromName(name?: string): string {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export function ProfileAvatar({
  uri,
  name,
  size = 44,
  style,
  borderColor = TQ.yellow,
  showInitials = false,
}: Props) {
  const radius = size / 2;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderWidth: 2,
            borderColor,
          },
          style,
        ]}
        contentFit="cover"
      />
    );
  }

  if (showInitials && name) {
    return (
      <View
        style={[
          styles.initials,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderColor,
          },
          style,
        ]}
      >
        <Text style={[styles.initialsText, { fontSize: size * 0.34 }]}>{initialsFromName(name)}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: radius,
          borderColor,
        },
        style,
      ]}
    >
      <Feather name="user" size={size * 0.42} color={TQ.gray400} />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: TQ.gray100,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    backgroundColor: TQ.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontFamily: TQFonts.bold,
    color: TQ.black,
    letterSpacing: 0.5,
  },
});
