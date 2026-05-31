import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { OwnerButton, OwnerHeader, OwnerScreen } from '@/components/owner/OwnerUIKit';
import { useOwnerProfile } from '@/context/owner-profile';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';

const BRANDS = 'Volvo, Scania, MAN, Mercedes-Benz, Isuzu, Hino';
const TYPES = 'Flatbed, Box Truck, Refrigerated, Tipper, Tanker, Pickup';

export default function TruckInfoScreen() {
  const { profile, updateTruck } = useOwnerProfile();
  const [plate, setPlate] = useState(profile.truck.plate);
  const [brand, setBrand] = useState(profile.truck.brand);
  const [size, setSize] = useState(profile.truck.size);
  const [type, setType] = useState(profile.truck.type);

  const save = () => {
    updateTruck({ plate, brand, size, type });
    Alert.alert('Saved', 'Truck information updated (UI only).');
    router.back();
  };

  return (
    <OwnerScreen>
      <OwnerHeader title="Truck Information" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.hint}>Examples: {BRANDS}</Text>
        <Field label="Number plate" value={plate} onChangeText={setPlate} placeholder="ABC 1234 ZW" />
        <Field label="Truck brand" value={brand} onChangeText={setBrand} placeholder="Volvo" />
        <Field label="Size / capacity" value={size} onChangeText={setSize} placeholder="15 Ton" />
        <Text style={styles.hint}>Types: {TYPES}</Text>
        <Field label="Truck type" value={type} onChangeText={setType} placeholder="Flatbed" />
        <OwnerButton label="Save" onPress={save} />
      </ScrollView>
    </OwnerScreen>
  );
}

function Field({ label, value, onChangeText, placeholder }: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={OW.gray400} />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  hint: { fontFamily: TQFonts.regular, fontSize: 11, color: OW.gray500, marginBottom: 8 },
  field: { marginBottom: 14 },
  label: { fontFamily: TQFonts.semiBold, fontSize: 13, color: OW.ink, marginBottom: 6 },
  input: {
    backgroundColor: OW.white,
    borderWidth: 1.5,
    borderColor: OW.gray200,
    borderRadius: TQRadii.sm,
    padding: 14,
    fontFamily: TQFonts.regular,
    fontSize: 14,
    color: OW.black,
  },
});
