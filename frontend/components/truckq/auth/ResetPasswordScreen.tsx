import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { ApiError, resetPassword } from '@/lib/auth-api';
import type { UserRole } from '@/lib/owner-types';

type Props = {
  role: UserRole;
  email: string;
  resetToken: string;
};

export function ResetPasswordScreen({ role, email, resetToken }: Props) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!password || !confirmPassword) {
      setError('Enter and confirm your new password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await resetPassword(email, resetToken, password, confirmPassword);
      Alert.alert('Password updated', 'You can now sign in with your new password.', [
        { text: 'OK', onPress: () => router.replace({ pathname: '/login', params: { role } }) },
      ]);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not update password. Try again.');
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
              onPress={() =>
                router.replace({
                  pathname: '/reset-password-otp',
                  params: { email, role },
                })
              }
              style={styles.backBtn}
              accessibilityLabel="Back"
            >
              <Feather name="chevron-left" size={26} color={AUTH.ink} />
            </TouchableOpacity>
          </View>

          <View style={styles.titleWrap}>
            <Text style={styles.title}>New password</Text>
            <Text style={styles.subtitle}>
              Choose a strong password with at least 8 characters.
            </Text>
          </View>

          <View style={styles.form}>
            {error ? (
              <View style={styles.errorWrap}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <AuthField
              label="New password"
              placeholder="At least 8 characters"
              icon={<Feather name="lock" size={18} color={AUTH.gray500} />}
              value={password}
              onChangeText={setPassword}
              secure
            />

            <AuthField
              label="Confirm password"
              placeholder="Re-enter your password"
              icon={<Feather name="lock" size={18} color={AUTH.gray500} />}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secure
            />

            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
              activeOpacity={0.85}
              onPress={() => void submit()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={AUTH.black} />
              ) : (
                <Text style={styles.primaryBtnText}>Update password</Text>
              )}
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
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { fontFamily: TQFonts.bold, fontSize: 16, color: AUTH.black },
});
