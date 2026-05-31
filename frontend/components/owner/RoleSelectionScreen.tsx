import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OW, TQFonts, TQRadii } from '@/constants/owner-design';
import type { UserRole } from '@/lib/owner-types';

const LOGO = require('@/assets/images/logo.png.jpeg');

type Props = {
  onSelect: (role: UserRole) => void;
};

function RoleCard({
  title,
  subtitle,
  icon,
  iconStyle,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: 'package-variant' | 'truck-outline';
  iconStyle: object;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardActive]}
    >
      <View style={[styles.iconWrap, iconStyle]}>
        <MaterialCommunityIcons name={icon} size={28} color={OW.black} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={22} color={OW.gray400} />
    </Pressable>
  );
}

export function RoleSelectionScreen({ onSelect }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.inner}>
        <Image source={LOGO} style={styles.logo} contentFit="contain" />
        <Text style={styles.title}>How will you use TruckQonnect?</Text>
        <Text style={styles.sub}>Choose your role to get the right experience</Text>

        <RoleCard
          title="I Need a Truck"
          subtitle="Post loads & hire drivers (Cargo Owner)"
          icon="package-variant"
          iconStyle={styles.iconCargo}
          onPress={() => onSelect('cargo')}
        />

        <RoleCard
          title="I Have a Truck"
          subtitle="Bid on loads & earn (Truck Owner)"
          icon="truck-outline"
          iconStyle={styles.iconDriver}
          onPress={() => onSelect('driver')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: OW.white },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 24, justifyContent: 'center' },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 24 },
  title: { fontFamily: TQFonts.bold, fontSize: 24, color: OW.black, textAlign: 'center' },
  sub: { fontFamily: TQFonts.regular, fontSize: 14, color: OW.gray500, textAlign: 'center', marginTop: 8, marginBottom: 32 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: OW.white,
    borderRadius: TQRadii.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: OW.gray200,
    gap: 14,
  },
  cardActive: { borderColor: OW.yellow, backgroundColor: OW.yellowSoft },
  iconWrap: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  iconCargo: { backgroundColor: OW.gray100 },
  iconDriver: { backgroundColor: OW.gray100 },
  cardText: { flex: 1 },
  cardTitle: { fontFamily: TQFonts.bold, fontSize: 16, color: OW.black },
  cardSub: { fontFamily: TQFonts.regular, fontSize: 12, color: OW.gray500, marginTop: 4 },
});
