import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Image } from 'expo-image';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { OwnerActiveJobProvider } from '@/context/owner-active-job';
import { AuthUserProvider } from '@/context/auth-user';
import { OwnerProfileProvider } from '@/context/owner-profile';
import { PostedLoadsProvider } from '@/context/posted-loads';
import { ShipperProfileProvider } from '@/context/shipper-profile';
import { UserRoleProvider } from '@/context/user-role';
import { clearLegacyFlowFlags } from '@/lib/app-flow-storage';

const LOGO = require('@/assets/images/logo.png');

SplashScreen.preventAutoHideAsync();

const truckNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F5D400',
    background: '#F3F4F6',
    card: '#FFFFFF',
    text: '#0A0A0A',
    border: '#E5E7EB',
    notification: '#F5D400',
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    void clearLegacyFlowFlags();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return (
      <View style={bootStyles.root}>
        <Image source={LOGO} style={bootStyles.bootLogo} contentFit="contain" />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserRoleProvider>
        <AuthUserProvider>
        <OwnerProfileProvider>
          <OwnerActiveJobProvider>
          <ShipperProfileProvider>
            <PostedLoadsProvider>
              <ThemeProvider value={truckNavTheme}>
                <Stack
              initialRouteName="index"
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: '#F3F4F6' },
              }}
            >
              <Stack.Screen name="index" options={{ gestureEnabled: false }} />
              <Stack.Screen name="splash" options={{ gestureEnabled: false, animation: 'fade' }} />
              <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="welcome" options={{ gestureEnabled: false, animation: 'fade' }} />
              <Stack.Screen name="choose-role" options={{ gestureEnabled: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="login" options={{ gestureEnabled: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="signup" options={{ gestureEnabled: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="forgot-password" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="reset-password-otp" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="reset-password" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="otp" options={{ gestureEnabled: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="chat" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="(owner-tabs)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="owner" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="profile" options={{ animation: 'fade' }} />
              <Stack.Screen name="cargo/settings" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="place-load" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="driver" />
              <Stack.Screen name="tracking" />
              <Stack.Screen name="delivery-done/[id]" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="rate-driver/[id]" options={{ animation: 'slide_from_right' }} />
                </Stack>
              </ThemeProvider>
              <StatusBar style="light" />
            </PostedLoadsProvider>
          </ShipperProfileProvider>
          </OwnerActiveJobProvider>
        </OwnerProfileProvider>
        </AuthUserProvider>
      </UserRoleProvider>
    </GestureHandlerRootView>
  );
}

const bootStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bootLogo: {
    width: 160,
    height: 160,
  },
});
