import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, OwnerScreen } from '@/components/owner/OwnerUIKit';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';
import { CHAT_THREADS } from '@/lib/owner-mock-data';

export default function OwnerChatList() {
  return (
    <OwnerScreen edges={['top']}>
      <View style={styles.head}>
        <Text style={styles.title}>Messages</Text>
      </View>
      <FlatList
        data={CHAT_THREADS}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({ pathname: '/owner/chat/[id]', params: { id: item.id } })
            }
          >
            <Avatar uri={item.customerAvatar} size={52} />
            <View style={styles.body}>
              <View style={styles.rowTop}>
                <Text style={styles.name}>{item.customerName}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.preview} numberOfLines={1}>{item.lastMessage}</Text>
              <Text style={styles.ref}>Load {item.loadRef}</Text>
            </View>
            {item.unread > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unread}</Text>
              </View>
            ) : (
              <Feather name="chevron-right" size={18} color={OW.gray400} />
            )}
          </Pressable>
        )}
      />
    </OwnerScreen>
  );
}

const styles = StyleSheet.create({
  head: { padding: 20 },
  title: { fontFamily: TQFonts.bold, fontSize: 24, color: OW.black },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: OW.white,
    padding: 14,
    borderRadius: TQRadii.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  body: { flex: 1 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontFamily: TQFonts.semiBold, fontSize: 15, color: OW.black },
  time: { fontFamily: TQFonts.regular, fontSize: 11, color: OW.gray500 },
  preview: { fontFamily: TQFonts.regular, fontSize: 13, color: OW.gray500, marginTop: 4 },
  ref: { fontFamily: TQFonts.medium, fontSize: 10, color: OW.yellowDeep, marginTop: 2 },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: OW.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { fontFamily: TQFonts.bold, fontSize: 11, color: OW.black },
});
