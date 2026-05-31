import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';
import { MOCK_NOTIFICATIONS, type AppNotification } from '@/lib/shipper-mock-data';

type Props = {
  visible: boolean;
  onClose: () => void;
  notifications?: AppNotification[];
  onItemsChange?: (items: AppNotification[]) => void;
};

export function NotificationsPanel({
  visible,
  onClose,
  notifications = MOCK_NOTIFICATIONS,
  onItemsChange,
}: Props) {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(notifications);

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  const markAllRead = () => {
    const next = items.map((n) => ({ ...n, read: true }));
    setItems(next);
    onItemsChange?.(next);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <View style={styles.head}>
            <Text style={styles.title}>Notifications</Text>
            <Pressable onPress={markAllRead} hitSlop={8}>
              <Text style={styles.markRead}>Mark all read</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {items.map((n) => (
              <NotificationRow key={n.id} item={n} />
            ))}
          </ScrollView>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function NotificationRow({ item }: { item: AppNotification }) {
  const icon =
    item.type === 'bid' ? 'dollar-sign' : item.type === 'delivery' ? 'package' : 'info';
  return (
    <View style={[styles.row, !item.read && styles.rowUnread]}>
      <View style={[styles.iconWrap, !item.read && styles.iconWrapActive]}>
        <Feather name={icon} size={18} color={TQ.black} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowBodyText}>{item.body}</Text>
        <Text style={styles.rowTime}>{item.time}</Text>
      </View>
      {!item.read ? <View style={styles.dot} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: TQ.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '78%',
    paddingTop: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: TQ.gray300,
    alignSelf: 'center',
    marginBottom: 12,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: { fontFamily: TQFonts.bold, fontSize: 20, color: TQ.ink },
  markRead: { fontFamily: TQFonts.semiBold, fontSize: 13, color: TQ.yellowDeep },
  list: { paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: TQRadii.lg,
    backgroundColor: TQ.gray100,
    marginBottom: 10,
  },
  rowUnread: {
    backgroundColor: TQ.yellowSoft,
    borderWidth: 1,
    borderColor: TQ.yellow,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: TQ.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: TQ.yellow },
  rowBody: { flex: 1 },
  rowTitle: { fontFamily: TQFonts.semiBold, fontSize: 15, color: TQ.ink },
  rowBodyText: {
    fontFamily: TQFonts.regular,
    fontSize: 13,
    color: TQ.gray600,
    marginTop: 4,
    lineHeight: 18,
  },
  rowTime: {
    fontFamily: TQFonts.regular,
    fontSize: 11,
    color: TQ.gray500,
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TQ.yellowDeep,
    marginTop: 6,
  },
  closeBtn: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: TQRadii.lg,
    backgroundColor: TQ.yellow,
  },
  closeText: { fontFamily: TQFonts.bold, fontSize: 15, color: TQ.black },
});
