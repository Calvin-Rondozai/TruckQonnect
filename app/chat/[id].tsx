import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';
import {
  getShipperMessagesForThread,
  getShipperThreadById,
  type ShipperChatMessage,
} from '@/lib/shipper-mock-data';

export default function ShipperChatDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = getShipperThreadById(id ?? 's-thread-1');
  const [messages, setMessages] = useState(getShipperMessagesForThread(id ?? 's-thread-1'));
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    const msg: ShipperChatMessage = {
      id: `sm-${Date.now()}`,
      threadId: id ?? 's-thread-1',
      text: text.trim(),
      time: 'Now',
      sender: 'shipper',
    };
    setMessages((m) => [...m, msg]);
    setText('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Feather name="chevron-left" size={26} color={TQ.black} />
        </Pressable>
        {thread ? (
          <>
            <Image source={{ uri: thread.driverAvatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{thread.driverName}</Text>
              <Text style={styles.ref}>Load {thread.loadRef}</Text>
            </View>
          </>
        ) : null}
        <Pressable style={styles.phoneBtn}>
          <Feather name="phone" size={20} color={TQ.black} />
        </Pressable>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.messages}
        renderItem={({ item }) => {
          const mine = item.sender === 'shipper';
          return (
            <View style={[styles.bubbleWrap, mine && styles.bubbleWrapMine]}>
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{item.text}</Text>
                <Text style={[styles.bubbleTime, mine && styles.bubbleTimeMine]}>{item.time}</Text>
              </View>
            </View>
          );
        }}
      />

      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={TQ.gray400}
          value={text}
          onChangeText={setText}
        />
        <Pressable style={styles.sendBtn} onPress={send}>
          <Feather name="send" size={18} color={TQ.black} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: TQ.gray100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: TQ.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TQ.gray200,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  name: { fontFamily: TQFonts.semiBold, fontSize: 16, color: TQ.ink },
  ref: { fontFamily: TQFonts.regular, fontSize: 11, color: TQ.gray500 },
  phoneBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TQ.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messages: { padding: 16, paddingBottom: 8 },
  bubbleWrap: { marginBottom: 10, alignItems: 'flex-start' },
  bubbleWrapMine: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: TQRadii.lg,
    backgroundColor: TQ.white,
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  bubbleMine: { backgroundColor: TQ.yellow, borderColor: TQ.yellowDeep },
  bubbleText: { fontFamily: TQFonts.regular, fontSize: 15, color: TQ.ink },
  bubbleTextMine: { color: TQ.black },
  bubbleTime: { fontFamily: TQFonts.regular, fontSize: 10, color: TQ.gray500, marginTop: 4 },
  bubbleTimeMine: { color: TQ.gray700 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: TQ.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TQ.gray200,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: TQ.gray100,
    paddingHorizontal: 16,
    fontFamily: TQFonts.medium,
    fontSize: 15,
    color: TQ.ink,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TQ.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
