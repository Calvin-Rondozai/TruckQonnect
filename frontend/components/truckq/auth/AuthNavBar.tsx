import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AUTH } from '@/components/truckq/auth/auth-theme';
import { TQFonts } from '@/constants/truckq-design';
import type { UserRole } from '@/lib/owner-types';

type AuthMode = 'login' | 'signup';

type Props = {
  mode: AuthMode;
  role: UserRole;
};

export function AuthNavBar({ mode, role }: Props) {
  const isLogin = mode === 'login';

  const goLogin = () => {
    if (!isLogin) {
      router.replace({ pathname: '/login', params: { role } });
    }
  };

  const goSignup = () => {
    if (isLogin) {
      router.replace({ pathname: '/signup', params: { role } });
    }
  };

  return (
    <View style={styles.tabs}>
      <TouchableOpacity style={styles.tabBtn} onPress={goLogin} activeOpacity={0.8}>
        <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Login</Text>
        {isLogin ? <View style={styles.tabUnderline} /> : null}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBtn} onPress={goSignup} activeOpacity={0.8}>
        <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Sign Up</Text>
        {!isLogin ? <View style={styles.tabUnderline} /> : null}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: AUTH.gray200,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
    position: 'relative',
  },
  tabText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 15,
    color: AUTH.gray500,
  },
  tabTextActive: {
    fontFamily: TQFonts.bold,
    color: AUTH.yellowDeep,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: '15%',
    right: '15%',
    height: 3,
    backgroundColor: AUTH.yellowDeep,
    borderRadius: 2,
  },
});
