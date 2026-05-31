import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { TQ } from '@/constants/truckq-design';

type FeatherName = ComponentProps<typeof Feather>['name'];

type Props = {
  name: FeatherName;
  color: string;
  size: number;
  focused: boolean;
};

export function TabBarIcon({ name, color, size, focused }: Props) {
  return (
    <View style={[styles.wrap, focused && styles.wrapActive]}>
      <Feather name={name} size={size} color={focused ? TQ.yellowDeep : color} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 32,
    borderRadius: 10,
  },
  wrapActive: {
    backgroundColor: TQ.yellowSoft,
  },
});
