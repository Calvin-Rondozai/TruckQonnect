import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { AuthNavBar } from '@/components/truckq/auth/AuthNavBar';
import { AuthRoleBadge } from '@/components/truckq/auth/AuthRoleBadge';
import { AUTH } from '@/components/truckq/auth/auth-theme';
import { TQFonts } from '@/constants/truckq-design';
import type { UserRole } from '@/lib/owner-types';

const LOGO = require('@/assets/images/logo.png.jpeg');

type Props = {
  role: UserRole;
  onAuthenticated: (phone: string, userType: UserRole) => void;
};

export function AuthLoginScreen({ role, onAuthenticated }: Props) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    onAuthenticated(phone.trim() || '+263', role);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <TouchableOpacity style={styles.helpBtn}>
              <Text style={styles.helpText}>Help</Text>
              <Feather name="headphones" size={16} color={AUTH.ink} style={styles.helpIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.logoWrap}>
            <Image source={LOGO} style={styles.logo} contentFit="contain" />
            <Text style={styles.brand}>
              Truck<Text style={styles.brandQ}>Q</Text>onnect
            </Text>
            <View style={styles.taglineRow}>
              <View style={styles.taglineLine} />
              <Text style={styles.tagline}>Connect. Load. Deliver.</Text>
              <View style={styles.taglineLine} />
            </View>
          </View>

          <View style={styles.titleWrap}>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>Login to continue to your account</Text>
          </View>

          <AuthRoleBadge role={role} />
          <AuthNavBar mode="login" role={role} />

          <View style={styles.form}>
            <AuthField
              label="Phone Number"
              placeholder="+263 77 123 4567"
              icon={<Feather name="phone" size={18} color={AUTH.gray500} />}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <AuthField
              label="Password"
              placeholder="Enter your password"
              icon={<Feather name="lock" size={18} color={AUTH.gray500} />}
              value={password}
              onChangeText={setPassword}
              secure
            />
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push({ pathname: '/forgot-password', params: { role } })}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={submit}>
              <Text style={styles.primaryBtnText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.bottomText}>
              By continuing, you agree to our{'\n'}
              <Text style={styles.bottomLink}>Terms of Service</Text> and{' '}
              <Text style={styles.bottomLink}>Privacy Policy</Text>
            </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerSpacer: { width: 32 },
  helpBtn: { flexDirection: 'row', alignItems: 'center' },
  helpIcon: { marginLeft: 4 },
  helpText: { fontFamily: TQFonts.semiBold, fontSize: 14, color: AUTH.ink },
  logoWrap: { alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
  logo: { width: 110, height: 110 },
  brand: {
    fontFamily: TQFonts.bold,
    fontSize: 28,
    color: AUTH.ink,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  brandQ: { color: AUTH.yellow },
  taglineRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  taglineLine: { width: 28, height: 2, backgroundColor: AUTH.yellow, borderRadius: 1 },
  tagline: { fontFamily: TQFonts.semiBold, fontSize: 12, color: AUTH.gray500 },
  titleWrap: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 4 },
  title: { fontFamily: TQFonts.bold, fontSize: 22, color: AUTH.ink, textAlign: 'center' },
  subtitle: {
    fontFamily: TQFonts.regular,
    fontSize: 14,
    color: AUTH.gray500,
    marginTop: 4,
    textAlign: 'center',
  },
  form: { paddingHorizontal: 20, paddingTop: 20 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -4 },
  forgotText: { fontFamily: TQFonts.semiBold, fontSize: 13, color: AUTH.yellowDeep },
  primaryBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: AUTH.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AUTH.yellowDeep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 24,
  },
  primaryBtnText: { fontFamily: TQFonts.bold, fontSize: 16, color: AUTH.black },
  bottomText: {
    fontFamily: TQFonts.regular,
    fontSize: 13,
    color: AUTH.gray500,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomLink: { fontFamily: TQFonts.bold, color: AUTH.yellowDeep },
});
