import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShipperProfile } from '@/context/shipper-profile';
import { useUserRole } from '@/context/user-role';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

const AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useShipperProfile();
  const { clearRole } = useUserRole();

  const [name, setName] = useState(profile.name);
  const [city, setCity] = useState(profile.city);
  const [phone, setPhone] = useState(profile.phone);
  const [company, setCompany] = useState(profile.company);
  const [email, setEmail] = useState(profile.email);

  useEffect(() => {
    setName(profile.name);
    setCity(profile.city);
    setPhone(profile.phone);
    setCompany(profile.company);
    setEmail(profile.email);
  }, [profile]);

  const save = async () => {
    await updateProfile({ name, city, phone, company, email });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Feather name="chevron-left" size={26} color={TQ.black} />
        </Pressable>
        <Text style={styles.headerTitle}>Your profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.hint}>You are posting loads as a shipper — drivers see this when you accept bids.</Text>

        <View style={styles.avatarWrap}>
          <Image source={{ uri: AVATAR }} style={styles.avatar} />
          <Pressable style={styles.changePhoto}>
            <Text style={styles.changePhotoText}>Change photo</Text>
          </Pressable>
        </View>

        <Field label="Full name" value={name} onChangeText={setName} placeholder="Your name" />
        <Field label="City" value={city} onChangeText={setCity} placeholder="Harare" />
        <Field label="Phone" value={phone} onChangeText={setPhone} placeholder="+263..." keyboard="phone-pad" />
        <Field label="Company" value={company} onChangeText={setCompany} placeholder="Business name" />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@company.co.zw"
          keyboard="email-address"
        />

        <Pressable style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.92 }]} onPress={save}>
          <Text style={styles.saveText}>Save changes</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.9 }]}
          onPress={() => {
            Alert.alert('Logout', 'Return to sign in?', [
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
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboard,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboard?: 'default' | 'email-address' | 'phone-pad';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={TQ.gray400}
        style={styles.input}
        keyboardType={keyboard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: TQ.gray100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: TQ.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TQ.gray200,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: TQFonts.semiBold,
    fontSize: 17,
    color: TQ.ink,
  },
  hint: {
    marginTop: 16,
    marginBottom: 20,
    fontFamily: TQFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: TQ.gray600,
  },
  avatarWrap: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: TQ.yellow,
  },
  changePhoto: { marginTop: 10 },
  changePhotoText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 14,
    color: TQ.gray700,
  },
  field: { marginBottom: 16 },
  label: {
    fontFamily: TQFonts.medium,
    fontSize: 13,
    color: TQ.gray600,
    marginBottom: 8,
  },
  input: {
    backgroundColor: TQ.white,
    borderRadius: TQRadii.md,
    borderWidth: 1,
    borderColor: TQ.gray200,
    paddingHorizontal: 14,
    height: 50,
    fontFamily: TQFonts.medium,
    fontSize: 15,
    color: TQ.ink,
  },
  saveBtn: {
    marginTop: 12,
    backgroundColor: TQ.yellow,
    borderRadius: TQRadii.lg,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  saveText: {
    fontFamily: TQFonts.bold,
    fontSize: 16,
    color: TQ.black,
  },
  logoutBtn: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: TQRadii.lg,
    borderWidth: 1.5,
    borderColor: TQ.gray200,
    backgroundColor: TQ.white,
  },
  logoutText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 15,
    color: TQ.gray700,
  },
});
