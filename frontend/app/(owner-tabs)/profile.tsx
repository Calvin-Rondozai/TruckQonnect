import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Avatar, OwnerButton, OwnerScreen } from '@/components/owner/OwnerUIKit';
import { useAuthUser } from '@/context/auth-user';
import { useUserRole } from '@/context/user-role';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';
import { pickProfileImage } from '@/lib/pick-profile-image';

export default function OwnerProfileScreen() {
  const { user, displayAvatar, roleLabel, updateProfile, uploadAvatar, logout } = useAuthUser();
  const { clearRole } = useUserRole();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [city, setCity] = useState(user?.city ?? '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const truck = user?.truck;

  const onPickPhoto = async () => {
    const picked = await pickProfileImage();
    if (!picked) return;
    setUploading(true);
    try {
      await uploadAvatar(picked.uri, picked.mimeType);
    } catch (e) {
      Alert.alert('Upload failed', e instanceof Error ? e.message : 'Try again.');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({ full_name: fullName.trim(), phone: phone.trim(), city: city.trim() });
      setEditing(false);
    } catch (e) {
      Alert.alert('Save failed', e instanceof Error ? e.message : 'Try again.');
    } finally {
      setSaving(false);
    }
  };

  const onLogout = () => {
    Alert.alert('Logout', 'Return to login?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          await clearRole();
          router.replace('/choose-role');
        },
      },
    ]);
  };

  return (
    <OwnerScreen edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.roleBadge}>
          <Feather name="truck" size={14} color={OW.black} />
          <Text style={styles.roleBadgeText}>{roleLabel}</Text>
        </View>

        <View style={styles.hero}>
          <Pressable onPress={() => void onPickPhoto()}>
            <Avatar uri={displayAvatar} size={88} />
            {uploading ? (
              <ActivityIndicator style={styles.uploading} color={OW.yellowDeep} />
            ) : (
              <Text style={styles.changePhoto}>Change photo</Text>
            )}
          </Pressable>

          {editing ? (
            <View style={styles.editBlock}>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Full name" />
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" />
              <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" />
              <Text style={styles.emailReadonly}>{user?.email}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.name}>{user?.full_name ?? 'Driver'}</Text>
              <Text style={styles.meta}>{user?.email}</Text>
              <Text style={styles.meta}>{user?.phone}</Text>
              {user?.city ? <Text style={styles.meta}>{user.city}</Text> : null}
            </>
          )}
        </View>

        {truck ? (
          <View style={styles.truckCard}>
            <View style={styles.truckInfo}>
              <Text style={styles.plate}>{truck.plate_number}</Text>
              <Text style={styles.truckMeta}>{truck.brand} · {truck.size_capacity}</Text>
              <Text style={styles.truckType}>{truck.truck_type}</Text>
            </View>
          </View>
        ) : null}

        {editing ? (
          <OwnerButton label={saving ? 'Saving…' : 'Save profile'} onPress={() => void save()} disabled={saving} />
        ) : (
          <OwnerButton label="Edit profile" variant="outline" onPress={() => setEditing(true)} />
        )}

        <Pressable style={styles.menuRow} onPress={() => router.push('/owner/truck-info' as '/owner/truck-info')}>
          <Feather name="package" size={20} color={OW.black} />
          <Text style={styles.menuLabel}>Truck Information</Text>
          <Feather name="chevron-right" size={20} color={OW.gray400} />
        </Pressable>

        <Pressable style={styles.menuRow} onPress={() => router.push('/owner/settings' as '/owner/settings')}>
          <Feather name="settings" size={20} color={OW.black} />
          <Text style={styles.menuLabel}>Settings</Text>
          <Feather name="chevron-right" size={20} color={OW.gray400} />
        </Pressable>

        <OwnerButton label="Logout" onPress={onLogout} variant="outline" />
      </ScrollView>
    </OwnerScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  roleBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: OW.yellow,
  },
  roleBadgeText: { fontFamily: TQFonts.semiBold, fontSize: 13, color: OW.black },
  hero: { alignItems: 'center', marginBottom: 20 },
  changePhoto: { fontFamily: TQFonts.semiBold, fontSize: 13, color: OW.gray500, marginTop: 8, textAlign: 'center' },
  uploading: { marginTop: 8 },
  name: { fontFamily: TQFonts.bold, fontSize: 22, color: OW.black, marginTop: 12 },
  meta: { fontFamily: TQFonts.regular, fontSize: 13, color: OW.gray500, marginTop: 4 },
  editBlock: { width: '100%', marginTop: 12, gap: 10 },
  input: {
    backgroundColor: OW.white,
    borderWidth: 1,
    borderColor: OW.gray200,
    borderRadius: TQRadii.md,
    paddingHorizontal: 14,
    height: 48,
    fontFamily: TQFonts.medium,
    fontSize: 15,
    color: OW.black,
  },
  emailReadonly: { fontFamily: TQFonts.regular, fontSize: 13, color: OW.gray500, textAlign: 'center' },
  truckCard: {
    backgroundColor: OW.white,
    borderRadius: TQRadii.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  truckInfo: {},
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
