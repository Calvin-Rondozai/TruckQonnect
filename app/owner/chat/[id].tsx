import { Feather } from '@expo/vector-icons';
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

import { Avatar, OwnerHeader, OwnerScreen } from '@/components/owner/OwnerUIKit';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';
import { getMessagesForThread, getThreadById } from '@/lib/owner-mock-data';
import type { OwnerChatMessage } from '@/lib/owner-types';

export default function OwnerChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = getThreadById(id ?? 'thread-1');
  const [messages, setMessages] = useState(getMessagesForThread(id ?? 'thread-1'));
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    const msg: OwnerChatMessage = {
      id: `m-${Date.now()}`,
      threadId: id ?? 'thread-1',
      text: text.trim(),
      time: 'Now',
      sender: 'driver',
    };
    setMessages((m) => [...m, msg]);
    setText('');
  };

  return (
    <OwnerScreen edges={['top', 'bottom']}>
      <OwnerHeader
        title={thread?.customerName ?? 'Chat'}
        onBack={() => router.back()}
        right={
          <Pressable onPress={() => {}}>
            <Feather name="phone" size={22} color={OW.black} />
          </Pressable>
        }
      />
      {thread ? (
        <View style={styles.threadHead}>
          <Avatar uri={thread.customerAvatar} size={36} />
        </View>
      ) : null}
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.bubbleWrap, item.sender === 'driver' && styles.bubbleWrapRight]}>
            <View style={[styles.bubble, item.sender === 'driver' ? styles.bubbleDriver : styles.bubbleCustomer]}>
              <Text style={[styles.bubbleText, item.sender === 'driver' && styles.bubbleTextDriver]}>{item.text}</Text>
              <Text style={styles.bubbleTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.typing}>
        <Text style={styles.typingText}>Customer is typing...</Text>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputRow}>
          <Pressable style={styles.attach}>
            <Feather name="paperclip" size={22} color={OW.gray500} />
          </Pressable>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor={OW.gray400}
          />
          <Pressable style={styles.send} onPress={send}>
            <Feather name="send" size={20} color={OW.black} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </OwnerScreen>
  );
}

const styles = StyleSheet.create({
  threadHead: { alignItems: 'center', paddingBottom: 8 },
  list: { padding: 16, paddingBottom: 8 },
  bubbleWrap: { marginBottom: 10, alignItems: 'flex-start' },
  bubbleWrapRight: { alignItems: 'flex-end' },
  bubble: { maxWidth: '78%', padding: 12, borderRadius: 16 },
  bubbleCustomer: { backgroundColor: OW.white, borderWidth: 1, borderColor: OW.gray200, borderTopLeftRadius: 4 },
  bubbleDriver: { backgroundColor: OW.yellow, borderTopRightRadius: 4 },
  bubbleText: { fontFamily: TQFonts.regular, fontSize: 14, color: OW.black },
  bubbleTextDriver: { color: OW.black },
  bubbleTime: { fontFamily: TQFonts.regular, fontSize: 10, color: OW.gray500, marginTop: 4, alignSelf: 'flex-end' },
  typing: { paddingHorizontal: 20, paddingBottom: 4 },
  typingText: { fontFamily: TQFonts.regular, fontSize: 11, color: OW.gray500, fontStyle: 'italic' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: OW.white,
    borderTopWidth: 1,
    borderTopColor: OW.gray200,
  },
  attach: { padding: 8 },
  input: {
    flex: 1,
    backgroundColor: OW.gray100,
    borderRadius: TQRadii.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: TQFonts.regular,
    fontSize: 14,
    color: OW.black,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: OW.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
