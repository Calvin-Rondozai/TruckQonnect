import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';
import { SHIPPER_CHAT_THREADS } from '@/lib/shipper-mock-data';

export default function ShipperChatList() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={SHIPPER_CHAT_THREADS}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingTop: 8 }}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]}
            onPress={() =>
              router.push({ pathname: '/chat/[id]', params: { id: item.id } })
            }
          >
            <Image source={{ uri: item.driverAvatar }} style={styles.avatar} />
            <View style={styles.body}>
              <View style={styles.rowTop}>
                <Text style={styles.name}>{item.driverName}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.preview} numberOfLines={1}>
                {item.lastMessage}
              </Text>
              <Text style={styles.ref}>Load {item.loadRef}</Text>
            </View>
            {item.unread > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unread}</Text>
              </View>
            ) : (
              <Feather name="chevron-right" size={18} color={TQ.gray400} />
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: TQ.gray100, paddingHorizontal: 16 },
  title: { fontFamily: TQFonts.bold, fontSize: 24, color: TQ.ink, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: TQ.white,
    padding: 14,
    borderRadius: TQRadii.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  body: { flex: 1 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontFamily: TQFonts.semiBold, fontSize: 15, color: TQ.ink },
  time: { fontFamily: TQFonts.regular, fontSize: 11, color: TQ.gray500 },
  preview: { fontFamily: TQFonts.regular, fontSize: 13, color: TQ.gray600, marginTop: 4 },
  ref: { fontFamily: TQFonts.medium, fontSize: 10, color: TQ.yellowDeep, marginTop: 2 },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: TQ.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { fontFamily: TQFonts.bold, fontSize: 11, color: TQ.black },
});
