import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { ApiError, requestPasswordReset } from '@/lib/auth-api';
import type { UserRole } from '@/lib/owner-types';

type Props = {
  role: UserRole;
};

export function ForgotPasswordScreen({ role }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendReset = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError('Enter the email linked to your account.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await requestPasswordReset(trimmed);
      router.push({
        pathname: '/reset-password-otp',
        params: {
          email: trimmed,
          emailMasked: res.email_masked ?? '',
          devOtp: res.dev_otp ?? '',
          role,
        },
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not send reset code. Try again.');
    } finally {
      setLoading(false);
    }
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
              Enter your email and we will send you a 6-digit code to reset your password.
            </Text>
          </View>

          <View style={styles.form}>
            {error ? (
              <View style={styles.errorWrap}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <AuthField
              label="Email"
              placeholder="you@example.com"
              icon={<Feather name="mail" size={18} color={AUTH.gray500} />}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
              activeOpacity={0.85}
              onPress={() => void sendReset()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={AUTH.black} />
              ) : (
                <Text style={styles.primaryBtnText}>Send reset code</Text>
              )}
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
  errorWrap: {
    backgroundColor: AUTH.redLight,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 13,
    color: AUTH.red,
    textAlign: 'center',
  },
  primaryBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: AUTH.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { fontFamily: TQFonts.bold, fontSize: 16, color: AUTH.black },
  backLink: {
    fontFamily: TQFonts.regular,
    fontSize: 14,
    color: AUTH.gray500,
    textAlign: 'center',
  },
  backLinkBold: { fontFamily: TQFonts.bold, color: AUTH.yellowDeep },
});
