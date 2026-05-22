import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AUTH, maskPhoneNumber } from '@/components/truckq/auth/auth-theme';
import { TQFonts } from '@/constants/truckq-design';

const LOGO = require('@/assets/images/logo.png.jpeg');

const { width: SCREEN_W } = Dimensions.get('window');
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
const MOCK_CODE = '123456';

const BOX_SIZE = Math.min(52, (SCREEN_W - 48 - 48 - 10 * (OTP_LENGTH - 1)) / OTP_LENGTH);

type OtpBoxProps = {
  value: string;
  focused: boolean;
  hasError: boolean;
  onPress: () => void;
};

function OtpBox({ value, focused, hasError, onPress }: OtpBoxProps) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.06,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
    pulse.stopAnimation();
    pulse.setValue(1);
  }, [focused, pulse]);

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.otpBox,
          focused && styles.otpBoxFocused,
          hasError && styles.otpBoxError,
          value && !hasError ? styles.otpBoxFilled : null,
          { transform: [{ scale: pulse }] },
        ]}
      >
        <Text style={[styles.otpText, hasError && styles.otpTextError]}>
          {value || (focused ? '|' : '')}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  phone?: string;
  onVerified: () => void;
  onChangeNumber: () => void;
  onSkip?: () => void;
};

export function OtpScreen({ phone, onVerified, onChangeNumber, onSkip }: Props) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const formSlide = useRef(new Animated.Value(40)).current;
  const formFade = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  const maskedPhone = maskPhoneNumber(phone ?? '');
  const timerLabel = `00:${String(timer).padStart(2, '0')}`;
  const codeComplete = otp.join('').length === OTP_LENGTH;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoFade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(formFade, { toValue: 1, duration: 700, delay: 300, useNativeDriver: true }),
      Animated.timing(formSlide, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [formFade, formSlide, logoFade, logoScale]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 600);
    return () => clearTimeout(id);
  }, []);

  const shake = useCallback(() => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const verify = useCallback(
    (code: string) => {
      setVerifying(true);
      setTimeout(() => {
        setVerifying(false);
        if (code !== MOCK_CODE) {
          setHasError(true);
          setErrorMsg('Invalid verification code. Please try again.');
          shake();
          setOtp(Array(OTP_LENGTH).fill(''));
          setFocusedIdx(0);
          inputRef.current?.focus();
        } else {
          setHasError(false);
          setErrorMsg('');
          onVerified();
        }
      }, 1200);
    },
    [onVerified, shake]
  );

  const handleChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH).split('');
    const next = Array(OTP_LENGTH).fill('');
    digits.forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    setFocusedIdx(Math.min(digits.length, OTP_LENGTH - 1));
    setHasError(false);
    setErrorMsg('');

    if (digits.length === OTP_LENGTH) {
      setTimeout(() => verify(digits.join('')), 200);
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setHasError(true);
      setErrorMsg('Please enter the complete 6-digit code.');
      shake();
      return;
    }
    verify(code);
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setOtp(Array(OTP_LENGTH).fill(''));
    setFocusedIdx(0);
    setHasError(false);
    setErrorMsg('');
    inputRef.current?.focus();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topRow}>
          <View style={styles.topSpacer} />
          {onSkip ? (
            <TouchableOpacity onPress={onSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.topSpacer} />
          )}
        </View>

        <View style={styles.inner}>
          <Animated.View
            style={[styles.logoWrap, { opacity: logoFade, transform: [{ scale: logoScale }] }]}
          >
            <Image source={LOGO} style={styles.logo} contentFit="contain" />
          </Animated.View>

          <Animated.View
            style={[styles.card, { opacity: formFade, transform: [{ translateY: formSlide }] }]}
          >
            <Text style={styles.title}>Verify Your Number</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{'\n'}
              <Text style={styles.phoneNum}>{maskedPhone}</Text>
            </Text>

            <TextInput
              ref={inputRef}
              value={otp.join('')}
              onChangeText={handleChange}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              style={styles.hiddenInput}
              caretHidden
            />

            <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}>
              {otp.map((digit, i) => (
                <OtpBox
                  key={i}
                  value={digit}
                  focused={focusedIdx === i && !hasError}
                  hasError={hasError}
                  onPress={() => {
                    setFocusedIdx(i);
                    inputRef.current?.focus();
                  }}
                />
              ))}
            </Animated.View>

            {hasError && errorMsg ? (
              <View style={styles.errorWrap}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.resendWrap}>
              <Text style={styles.resendLabel}>Didn't receive code? </Text>
              {canResend ? (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendAction}>Resend Code</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendTimer}>Resend in {timerLabel}</Text>
              )}
            </View>

            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[styles.verifyBtn, (verifying || !codeComplete) && styles.verifyBtnDisabled]}
                onPress={handleVerify}
                onPressIn={() =>
                  Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start()
                }
                onPressOut={() =>
                  Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start()
                }
                activeOpacity={1}
                disabled={verifying}
              >
                <Text style={styles.verifyBtnText}>
                  {verifying ? 'Verifying...' : 'Verify & Continue'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.changeNumBtn} onPress={onChangeNumber}>
              <Text style={styles.changeNumText}>Change Number</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AUTH.white,
  },
  flex: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  topSpacer: {
    width: 48,
  },
  skipText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 15,
    color: AUTH.ink,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: AUTH.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  logo: {
    width: 150,
    height: 150,
  },
  card: {
    width: '100%',
    backgroundColor: AUTH.white,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderWidth: 1,
    borderColor: AUTH.gray200,
    shadowColor: AUTH.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    fontFamily: TQFonts.bold,
    fontSize: 24,
    color: AUTH.ink,
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: TQFonts.regular,
    fontSize: 14,
    color: AUTH.gray500,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  phoneNum: {
    fontFamily: TQFonts.bold,
    color: AUTH.black,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  otpBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: 14,
    backgroundColor: AUTH.inputBg,
    borderWidth: 2,
    borderColor: AUTH.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFocused: {
    borderColor: AUTH.yellow,
    backgroundColor: AUTH.white,
    shadowColor: AUTH.yellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  otpBoxFilled: {
    borderColor: AUTH.yellowDeep,
    backgroundColor: AUTH.white,
  },
  otpBoxError: {
    borderColor: AUTH.red,
    backgroundColor: AUTH.redLight,
  },
  otpText: {
    fontFamily: TQFonts.bold,
    fontSize: 22,
    color: AUTH.black,
  },
  otpTextError: {
    color: AUTH.red,
  },
  errorWrap: {
    backgroundColor: AUTH.redLight,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
    width: '100%',
  },
  errorText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 13,
    color: AUTH.red,
    textAlign: 'center',
  },
  resendWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 28,
    marginTop: 4,
  },
  resendLabel: {
    fontFamily: TQFonts.regular,
    fontSize: 13,
    color: AUTH.gray500,
  },
  resendTimer: {
    fontFamily: TQFonts.bold,
    fontSize: 13,
    color: AUTH.black,
  },
  resendAction: {
    fontFamily: TQFonts.bold,
    fontSize: 13,
    color: AUTH.yellowDeep,
    textDecorationLine: 'underline',
  },
  verifyBtn: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: AUTH.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AUTH.yellowDeep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  verifyBtnDisabled: {
    opacity: 0.55,
  },
  verifyBtnText: {
    fontFamily: TQFonts.bold,
    fontSize: 16,
    color: AUTH.black,
    letterSpacing: 0.3,
    padding: 17,
    paddingBottom: 10,
  },
  changeNumBtn: {
    paddingVertical: 6,
  },
  changeNumText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 14,
    color: AUTH.gray500,
    textDecorationLine: 'underline',
  },
});
