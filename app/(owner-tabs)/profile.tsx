import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar, OwnerButton, OwnerScreen } from '@/components/owner/OwnerUIKit';
import { useOwnerProfile } from '@/context/owner-profile';
import { useUserRole } from '@/context/user-role';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';

export default function OwnerProfileScreen() {
  const { profile } = useOwnerProfile();
  const { clearRole } = useUserRole();

  const logout = () => {
    Alert.alert('Logout', 'Return to login?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearRole();
          router.replace('/choose-role');
        },
      },
    ]);
  };

  return (
    <OwnerScreen edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Avatar uri={profile.avatar} size={88} />
          <Text style={styles.name}>{profile.name}</Text>
          <View style={styles.verifyRow}>
            {profile.verified ? (
              <View style={styles.verified}>
                <Feather name="check-circle" size={14} color={OW.green} />
                <Text style={styles.verifiedText}>Verified driver</Text>
              </View>
            ) : null}
            <Text style={styles.rating}>★ {profile.rating} · {profile.trips} trips</Text>
          </View>
        </View>

        <View style={styles.truckCard}>
          <Image source={{ uri: profile.truck.image }} style={styles.truckImg} contentFit="cover" />
          <View style={styles.truckInfo}>
            <Text style={styles.plate}>{profile.truck.plate}</Text>
            <Text style={styles.truckMeta}>{profile.truck.brand} · {profile.truck.size}</Text>
            <Text style={styles.truckType}>{profile.truck.type}</Text>
          </View>
        </View>

        {[
          { icon: 'package' as const, label: 'Truck Information', route: '/owner/truck-info' },
          { icon: 'file-text' as const, label: 'Documents', route: null },
          { icon: 'settings' as const, label: 'Settings', route: '/owner/settings' },
        ].map((row) => (
          <Pressable
            key={row.label}
            style={styles.menuRow}
            onPress={() => row.route && router.push(row.route as '/owner/truck-info')}
          >
            <Feather name={row.icon} size={20} color={OW.black} />
            <Text style={styles.menuLabel}>{row.label}</Text>
            <Feather name="chevron-right" size={20} color={OW.gray400} />
          </Pressable>
        ))}

        <OwnerButton label="Logout" onPress={logout} variant="outline" />
      </ScrollView>
    </OwnerScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  hero: { alignItems: 'center', marginBottom: 20 },
  name: { fontFamily: TQFonts.bold, fontSize: 22, color: OW.black, marginTop: 12 },
  verifyRow: { alignItems: 'center', marginTop: 6, gap: 4 },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontFamily: TQFonts.semiBold, fontSize: 12, color: OW.green },
  rating: { fontFamily: TQFonts.regular, fontSize: 13, color: OW.gray500 },
  truckCard: {
    flexDirection: 'row',
    backgroundColor: OW.white,
    borderRadius: TQRadii.lg,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  truckImg: { width: 110, height: 100 },
  truckInfo: { flex: 1, padding: 14, justifyContent: 'center' },
  plate: { fontFamily: TQFonts.bold, fontSize: 16, color: OW.black },
  truckMeta: { fontFamily: TQFonts.regular, fontSize: 12, color: OW.gray500, marginTop: 4 },
  truckType: { fontFamily: TQFonts.semiBold, fontSize: 12, color: OW.yellowDeep, marginTop: 2 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: OW.white,
    padding: 16,
    borderRadius: TQRadii.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  menuLabel: { flex: 1, fontFamily: TQFonts.semiBold, fontSize: 15, color: OW.black },
});
