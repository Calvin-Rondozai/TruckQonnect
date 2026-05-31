import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { OwnerButton, OwnerHeader, OwnerScreen } from '@/components/owner/OwnerUIKit';
import { useOwnerActiveJob } from '@/context/owner-active-job';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';
import { getLoadById } from '@/lib/owner-mock-data';

export default function BidScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const load = getLoadById(id ?? '');
  const { acceptLoad } = useOwnerActiveJob();
  const [amount, setAmount] = useState(load ? String(load.suggestedPrice) : '');
  const [eta, setEta] = useState('6');

  const submit = () => {
    const bid = Number(amount) || load?.suggestedPrice || 0;
    const hours = Number(eta) || 6;
    if (id) acceptLoad(id, bid, hours);
    Alert.alert(
      'Bid accepted!',
      `You're assigned to this load. Open Track to see pickup and delivery on the map.`,
      [
        {
          text: 'Open Track',
          onPress: () => router.replace('/(owner-tabs)/track' as '/(owner-tabs)/track'),
        },
      ]
    );
  };

  return (
    <OwnerScreen>
      <OwnerHeader title="Place Bid" onBack={() => router.back()} />
      <View style={styles.body}>
        <Text style={styles.route}>{load?.pickup} → {load?.dropoff}</Text>
        <Text style={styles.label}>Bid amount (USD)</Text>
        <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0" placeholderTextColor={OW.gray400} />
        <Text style={styles.label}>Estimated arrival (hours)</Text>
        <TextInput style={styles.input} value={eta} onChangeText={setEta} keyboardType="numeric" placeholder="6" placeholderTextColor={OW.gray400} />
        <Text style={styles.hint}>Suggested: ${load?.suggestedPrice} · Budget: ${load?.budget}</Text>
        <OwnerButton label="Submit Bid" onPress={submit} />
      </View>
    </OwnerScreen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 12 },
  route: { fontFamily: TQFonts.semiBold, fontSize: 15, color: OW.black, marginBottom: 8 },
  label: { fontFamily: TQFonts.semiBold, fontSize: 13, color: OW.ink },
  input: {
    backgroundColor: OW.white,
    borderWidth: 1.5,
    borderColor: OW.gray200,
    borderRadius: TQRadii.sm,
    padding: 14,
    fontFamily: TQFonts.regular,
    fontSize: 16,
    color: OW.black,
  },
  hint: { fontFamily: TQFonts.regular, fontSize: 12, color: OW.gray500, marginBottom: 12 },
});
