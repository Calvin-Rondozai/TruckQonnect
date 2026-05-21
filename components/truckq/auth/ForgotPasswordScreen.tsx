import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthField } from '@/components/truckq/auth/AuthField';
import { AUTH } from '@/components/truckq/auth/auth-theme';
import { TQFonts } from '@/constants/truckq-design';
import type { UserRole } from '@/lib/owner-types';

type Props = {
  role: UserRole;
};

export function ForgotPasswordScreen({ role }: Props) {
  const [phone, setPhone] = useState('');

  const sendReset = () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      Alert.alert('Phone required', 'Enter the phone number linked to your account.');
      return;
    }
    Alert.alert(
      'Reset link sent',
      `If an account exists for ${trimmed}, you will receive reset instructions shortly.`,
      [{ text: 'OK', onPress: () => router.replace({ pathname: '/login', params: { role } }) }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.replace({ pathname: '/login', params: { role } })}
              style={styles.backBtn}
              accessibilityLabel="Back to login"
            >
              <Feather name="chevron-left" size={26} color={AUTH.ink} />
            </TouchableOpacity>
          </View>

          <View style={styles.titleWrap}>
            <Text style={styles.title}>Forgot password?</Text>
            <Text style={styles.subtitle}>
              Enter your phone number and we will send you instructions to reset your password.
            </Text>
          </View>

          <View style={styles.form}>
            <AuthField
              label="Phone Number"
              placeholder="+263 77 123 4567"
              icon={<Feather name="phone" size={18} color={AUTH.gray500} />}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={sendReset}>
              <Text style={styles.primaryBtnText}>Send reset link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace({ pathname: '/login', params: { role } })}
            >
              <Text style={styles.backLink}>
                Remember your password? <Text style={styles.backLinkBold}>Back to Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AUTH.white },
  flex: { flex: 1 },
  scroll: { paddingBottom: 48 },
  header: { paddingHorizontal: 16, paddingTop: 8 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  titleWrap: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  title: { fontFamily: TQFonts.bold, fontSize: 24, color: AUTH.ink },
  subtitle: {
    fontFamily: TQFonts.regular,
    fontSize: 14,
    color: AUTH.gray500,
    marginTop: 8,
    lineHeight: 22,
  },
  form: { paddingHorizontal: 20, paddingTop: 24 },
  primaryBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: AUTH.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  primaryBtnText: { fontFamily: TQFonts.bold, fontSize: 16, color: AUTH.black },
  backLink: {
    fontFamily: TQFonts.regular,
    fontSize: 14,
    color: AUTH.gray500,
    textAlign: 'center',
  },
  backLinkBold: { fontFamily: TQFonts.bold, color: AUTH.yellowDeep },
});
