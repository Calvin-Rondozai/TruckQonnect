import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { TQ } from '@/constants/truckq-design';

type Props = {
  uri?: string | null;
  size?: number;
  style?: ViewStyle;
  borderColor?: string;
};

export function ProfileAvatar({ uri, size = 44, style, borderColor = TQ.yellow }: Props) {
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
});
