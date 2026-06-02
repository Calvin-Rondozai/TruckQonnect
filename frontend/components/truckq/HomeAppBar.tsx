import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileAvatar } from '@/components/truckq/ProfileAvatar';
import { OW } from '@/constants/owner-design';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';
import { useAuthUser } from '@/context/auth-user';

type Props = {
  unreadCount?: number;
  onNotificationsPress: () => void;
  profileHref?: string;
  /** Overrides profile company from auth (e.g. owner mock profile) */
  companyName?: string;
  /** Owner (trucker) styling — defaults to cargo (client) */
  variant?: 'cargo' | 'owner';
};

export function HomeAppBar({
  unreadCount = 0,
  onNotificationsPress,
  profileHref,
  companyName,
  variant = 'cargo',
}: Props) {
  const router = useRouter();
  const { user, displayAvatar } = useAuthUser();
  const isOwner = variant === 'owner';
  const palette = isOwner
    ? { bg: OW.white, border: OW.gray200, ink: OW.black, sub: OW.gray500, badge: OW.yellow }
    : { bg: TQ.white, border: TQ.gray200, ink: TQ.ink, sub: TQ.gray500, badge: TQ.yellow };

  const firstName = (user?.full_name ?? 'Guest').split(' ')[0];
  const company = (companyName ?? user?.company)?.trim();
  const profileRoute = profileHref ?? (isOwner ? '/(owner-tabs)/profile' : '/(tabs)/profile');

  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [styles.greetBlock, pressed && { opacity: 0.88 }]}
        onPress={() => router.push(profileRoute as never)}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
      >
        <Text style={[styles.hello, { color: palette.ink }]}>Hello {firstName}</Text>
        {company ? (
          <Text style={[styles.company, { color: palette.sub }]} numberOfLines={1}>
            {company}
          </Text>
        ) : null}
      </Pressable>

      <View style={styles.right}>
        <Pressable
          style={[styles.notif, { backgroundColor: palette.bg, borderColor: palette.border }]}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={onNotificationsPress}
        >
          <Feather name="bell" size={20} color={palette.ink} />
          {unreadCount > 0 ? (
            <View style={[styles.notifBadge, { backgroundColor: palette.badge }]}>
              <Text style={styles.notifBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          ) : null}
        </Pressable>
        <Pressable onPress={() => router.push(profileRoute as never)} accessibilityLabel="Profile">
          <ProfileAvatar
            uri={displayAvatar}
            name={user?.full_name}
            size={40}
            borderColor={isOwner ? OW.green : '#1B6B3A'}
            showInitials
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  greetBlock: {
    flex: 1,
    paddingRight: 12,
  },
  hello: {
    fontFamily: TQFonts.bold,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  company: {
    fontFamily: TQFonts.medium,
    fontSize: 13,
    marginTop: 1,
    lineHeight: 16,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notif: {
    width: 44,
    height: 44,
    borderRadius: TQRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  notifBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: TQ.white,
  },
  notifBadgeText: {
    fontFamily: TQFonts.bold,
    fontSize: 9,
    color: TQ.black,
  },
});
