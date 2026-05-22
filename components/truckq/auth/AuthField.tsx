import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AUTH } from '@/components/truckq/auth/auth-theme';
import { TQFonts } from '@/constants/truckq-design';

type Props = {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChangeText: (v: string) => void;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  optional?: boolean;
};

export function AuthField({
  label,
  placeholder,
  icon,
  value,
  onChangeText,
  secure,
  keyboardType,
  optional,
}: Props) {
  const [hidden, setHidden] = useState(Boolean(secure));
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {optional ? <Text style={styles.optional}> (Optional)</Text> : null}
      </Text>
      <View style={[styles.box, focused && styles.boxFocused]}>
        <View style={styles.icon}>{icon}</View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={AUTH.gray400}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secure ? (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} style={styles.eyeBtn}>
            <Feather name={hidden ? 'eye-off' : 'eye'} size={18} color={AUTH.gray500} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  label: {
    fontFamily: TQFonts.semiBold,
    fontSize: 13,
    color: AUTH.ink,
    marginBottom: 6,
  },
  optional: {
    fontFamily: TQFonts.regular,
    fontWeight: '400',
    color: AUTH.gray500,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AUTH.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AUTH.gray200,
  },
  boxFocused: {
    borderColor: AUTH.yellowDeep,
  },
  icon: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontFamily: TQFonts.regular,
    fontSize: 14,
    color: AUTH.ink,
    paddingVertical: 14,
    paddingRight: 12,
  },
  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
});
