import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { Image } from 'expo-image';

import { router } from 'expo-router';

import React, { useState } from 'react';

import {

  ActivityIndicator,

  KeyboardAvoidingView,

  Platform,

  Pressable,

  ScrollView,

  StyleSheet,

  Text,

  TouchableOpacity,

  View,

} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';



import type { AuthOtpParams } from '@/components/truckq/auth/AuthLoginScreen';

import { AuthField } from '@/components/truckq/auth/AuthField';

import { AuthNavBar } from '@/components/truckq/auth/AuthNavBar';

import { AuthRoleBadge } from '@/components/truckq/auth/AuthRoleBadge';

import { AUTH } from '@/components/truckq/auth/auth-theme';

import { TQFonts } from '@/constants/truckq-design';

import { ApiError, registerAccount } from '@/lib/auth-api';

import { pickProfileImage } from '@/lib/pick-profile-image';

import { setPendingSignupAvatar, clearPendingSignupAvatar } from '@/lib/pending-signup-avatar';

import type { UserRole } from '@/lib/owner-types';



type Props = {

  role: UserRole;

  onOtpRequired: (params: AuthOtpParams) => void;

};



export function AuthSignupScreen({ role, onOtpRequired }: Props) {

  const [fullName, setFullName] = useState('');

  const [signupPhone, setSignupPhone] = useState('');

  const [email, setEmail] = useState('');

  const [company, setCompany] = useState('');

  const [signupPassword, setSignupPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [agreed, setAgreed] = useState(false);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const [avatarMime, setAvatarMime] = useState('image/jpeg');



  const [plateNumber, setPlateNumber] = useState('');

  const [truckBrand, setTruckBrand] = useState('');

  const [truckSize, setTruckSize] = useState('');

  const [truckType, setTruckType] = useState('');



  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');



  const isDriver = role === 'driver';



  const onPickPhoto = async () => {

    const picked = await pickProfileImage();

    if (!picked) return;

    setAvatarUri(picked.uri);

    setAvatarMime(picked.mimeType);

  };



  const submit = async () => {

    if (!agreed) return;

    if (!fullName.trim() || !signupPhone.trim() || !email.trim()) {

      setError('Full name, phone, and email are required.');

      return;

    }

    if (!isDriver && !company.trim()) {

      setError('Company name is required for cargo clients.');

      return;

    }

    if (signupPassword !== confirmPassword) {

      setError('Passwords do not match.');

      return;

    }

    if (isDriver && (!plateNumber.trim() || !truckBrand.trim() || !truckSize.trim() || !truckType.trim())) {

      setError('Complete all truck information fields.');

      return;

    }



    setLoading(true);

    setError('');

    try {

      if (avatarUri) {

        await setPendingSignupAvatar(avatarUri, avatarMime);

      }



      const res = await registerAccount({

        full_name: fullName.trim(),

        email: email.trim().toLowerCase(),

        phone: signupPhone.trim(),

        password: signupPassword,

        password_confirm: confirmPassword,

        role,

        company: isDriver ? undefined : company.trim(),

        truck: isDriver

          ? {

              plate_number: plateNumber.trim(),

              brand: truckBrand.trim(),

              size_capacity: truckSize.trim(),

              truck_type: truckType.trim(),

            }

          : undefined,

      });

      onOtpRequired({
        email: res.email,
        emailMasked: res.email_masked,
        role: res.role,
        devOtp: res.dev_otp,
      });

    } catch (e) {
      await clearPendingSignupAvatar();
      setError(e instanceof ApiError ? e.message : 'Sign up failed. Please try again.');
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

          showsVerticalScrollIndicator={false}

          keyboardShouldPersistTaps="handled"

        >

          <View style={styles.header}>

            <TouchableOpacity

              onPress={() => router.replace({ pathname: '/login', params: { role } })}

              style={styles.backBtn}

              accessibilityLabel="Back to login"

            >

              <Feather name="chevron-left" size={24} color={AUTH.ink} />

            </TouchableOpacity>

            <TouchableOpacity style={styles.helpBtn}>

              <Text style={styles.helpText}>Help</Text>

              <Feather name="headphones" size={16} color={AUTH.ink} style={styles.helpIcon} />

            </TouchableOpacity>

          </View>



          <View style={styles.titleWrap}>

            <Text style={styles.title}>Create your account</Text>

            <Text style={styles.subtitle}>Sign up to get started</Text>

          </View>



          <AuthRoleBadge role={role} />

          <AuthNavBar mode="signup" role={role} />



          <View style={styles.form}>

            <Text style={styles.sectionLabel}>Personal Information</Text>



            <Pressable style={styles.photoRow} onPress={() => void onPickPhoto()}>

              {avatarUri ? (

                <Image source={{ uri: avatarUri }} style={styles.photoPreview} contentFit="cover" />

              ) : (

                <View style={styles.photoPlaceholder}>

                  <Feather name="camera" size={22} color={AUTH.gray500} />

                </View>

              )}

              <View style={styles.photoTextWrap}>

                <Text style={styles.photoTitle}>Profile photo</Text>

                <Text style={styles.photoSub}>

                  {avatarUri ? 'Tap to change photo' : 'Optional — tap to add a photo'}

                </Text>

              </View>

              <Feather name="chevron-right" size={20} color={AUTH.gray400} />

            </Pressable>



            <AuthField

              label="Full Name"

              placeholder="Enter your full name"

              icon={<Feather name="user" size={18} color={AUTH.gray500} />}

              value={fullName}

              onChangeText={setFullName}

            />

            <AuthField

              label="Phone Number"

              placeholder="+263 77 123 4567"

              icon={<Feather name="phone" size={18} color={AUTH.gray500} />}

              value={signupPhone}

              onChangeText={setSignupPhone}

              keyboardType="phone-pad"

            />

            <AuthField

              label="Email Address"

              placeholder="Enter your email address"

              icon={<Feather name="mail" size={18} color={AUTH.gray500} />}

              value={email}

              onChangeText={setEmail}

              keyboardType="email-address"

              autoCapitalize="none"

            />

            {!isDriver ? (

              <AuthField

                label="Company Name"

                placeholder="Your business or company name"

                icon={<Feather name="briefcase" size={18} color={AUTH.gray500} />}

                value={company}

                onChangeText={setCompany}

              />

            ) : null}

            <AuthField

              label="Password"

              placeholder="Create a password (min. 8 characters)"

              icon={<Feather name="lock" size={18} color={AUTH.gray500} />}

              value={signupPassword}

              onChangeText={setSignupPassword}

              secure

            />

            <AuthField

              label="Confirm Password"

              placeholder="Confirm your password"

              icon={<Feather name="lock" size={18} color={AUTH.gray500} />}

              value={confirmPassword}

              onChangeText={setConfirmPassword}

              secure

            />



            {isDriver ? (

              <>

                <View style={styles.sectionDivider} />

                <Text style={styles.sectionLabel}>Truck Information</Text>

                <AuthField

                  label="Truck Number Plate"

                  placeholder="e.g. ABC 1234 ZW"

                  icon={

                    <MaterialCommunityIcons name="card-text-outline" size={18} color={AUTH.gray500} />

                  }

                  value={plateNumber}

                  onChangeText={setPlateNumber}

                />

                <AuthField

                  label="Truck Brand"

                  placeholder="e.g. Volvo, Isuzu, Mercedes"

                  icon={<MaterialCommunityIcons name="truck-outline" size={18} color={AUTH.gray500} />}

                  value={truckBrand}

                  onChangeText={setTruckBrand}

                />

                <AuthField

                  label="Truck Size / Capacity"

                  placeholder="e.g. 10 Ton, 30+ Ton"

                  icon={<MaterialCommunityIcons name="weight" size={18} color={AUTH.gray500} />}

                  value={truckSize}

                  onChangeText={setTruckSize}

                />

                <AuthField

                  label="Truck Type"

                  placeholder="e.g. Flatbed, Refrigerated, Tipper"

                  icon={<MaterialCommunityIcons name="truck-flatbed" size={18} color={AUTH.gray500} />}

                  value={truckType}

                  onChangeText={setTruckType}

                />

              </>

            ) : null}



            {error ? (

              <View style={styles.errorWrap}>

                <Text style={styles.errorText}>{error}</Text>

              </View>

            ) : null}



            <TouchableOpacity

              style={styles.termsRow}

              onPress={() => setAgreed((a) => !a)}

              activeOpacity={0.8}

            >

              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>

                {agreed ? <Feather name="check" size={12} color={AUTH.white} /> : null}

              </View>

              <Text style={styles.termsText}>

                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}

                <Text style={styles.termsLink}>Privacy Policy</Text>

              </Text>

            </TouchableOpacity>



            <TouchableOpacity

              style={[styles.primaryBtn, (!agreed || loading) && styles.primaryBtnDisabled]}

              activeOpacity={agreed ? 0.85 : 1}

              disabled={!agreed || loading}

              onPress={() => void submit()}

            >

              {loading ? (

                <ActivityIndicator color={AUTH.black} />

              ) : (

                <Text style={styles.primaryBtnText}>Sign Up</Text>

              )}

            </TouchableOpacity>



            <Text style={styles.bottomText}>

              Already have an account?{' '}

              <Text

                style={styles.bottomLink}

                onPress={() => router.replace({ pathname: '/login', params: { role } })}

              >

                Login

              </Text>

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

  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },

  helpBtn: { flexDirection: 'row', alignItems: 'center' },

  helpIcon: { marginLeft: 4 },

  helpText: { fontFamily: TQFonts.semiBold, fontSize: 14, color: AUTH.ink },

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

  sectionLabel: {

    fontFamily: TQFonts.bold,

    fontSize: 13,

    color: AUTH.gray700,

    textTransform: 'uppercase',

    letterSpacing: 0.8,

    marginBottom: 12,

    marginTop: 4,

  },

  photoRow: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 14,

    marginBottom: 16,

    padding: 12,

    borderRadius: 14,

    backgroundColor: AUTH.inputBg,

    borderWidth: 1,

    borderColor: AUTH.gray200,

  },

  photoPreview: {

    width: 52,

    height: 52,

    borderRadius: 26,

  },

  photoPlaceholder: {

    width: 52,

    height: 52,

    borderRadius: 26,

    backgroundColor: AUTH.white,

    borderWidth: 1.5,

    borderColor: AUTH.gray200,

    borderStyle: 'dashed',

    alignItems: 'center',

    justifyContent: 'center',

  },

  photoTextWrap: { flex: 1 },

  photoTitle: { fontFamily: TQFonts.semiBold, fontSize: 14, color: AUTH.ink },

  photoSub: { fontFamily: TQFonts.regular, fontSize: 12, color: AUTH.gray500, marginTop: 2 },

  sectionDivider: { height: 1, backgroundColor: AUTH.gray200, marginVertical: 20 },

  errorWrap: {

    backgroundColor: AUTH.redLight,

    borderRadius: 10,

    paddingVertical: 10,

    paddingHorizontal: 14,

    marginBottom: 12,

  },

  errorText: { fontFamily: TQFonts.semiBold, fontSize: 13, color: AUTH.red, textAlign: 'center' },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 20, marginTop: 4 },

  checkbox: {

    width: 20,

    height: 20,

    borderRadius: 6,

    borderWidth: 2,

    borderColor: AUTH.gray400,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 1,

  },

  checkboxChecked: { backgroundColor: AUTH.yellowDeep, borderColor: AUTH.yellowDeep },

  termsText: { flex: 1, fontFamily: TQFonts.regular, fontSize: 13, color: AUTH.gray700, lineHeight: 20 },

  termsLink: { fontFamily: TQFonts.bold, color: AUTH.yellowDeep },

  primaryBtn: {

    height: 54,

    borderRadius: 27,

    backgroundColor: AUTH.yellow,

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 20,

  },

  primaryBtnDisabled: { opacity: 0.5 },

  primaryBtnText: { fontFamily: TQFonts.bold, fontSize: 16, color: AUTH.black },

  bottomText: {

    fontFamily: TQFonts.regular,

    fontSize: 13,

    color: AUTH.gray500,

    textAlign: 'center',

  },

  bottomLink: { fontFamily: TQFonts.bold, color: AUTH.yellowDeep },

});


