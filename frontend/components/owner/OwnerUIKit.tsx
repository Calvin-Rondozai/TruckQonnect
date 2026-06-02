import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OW, TQFonts, TQRadii } from '@/constants/owner-design';
import type { OwnerLoad } from '@/lib/owner-types';

export function OwnerScreen({
  children,
  style,
  edges = ['top'],
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: ('top' | 'bottom')[];
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.screen,
        edges.includes('top') && { paddingTop: insets.top },
        edges.includes('bottom') && { paddingBottom: insets.bottom },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function OwnerHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.headerBtn}>
          <Feather name="chevron-left" size={24} color={OW.black} />
        </Pressable>
      ) : (
        <View style={styles.headerBtn} />
      )}
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
      </View>
      <View style={styles.headerBtn}>{right}</View>
    </View>
  );
}

export function OwnerButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'dark';
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        variant === 'primary' && styles.btnPrimary,
        variant === 'outline' && styles.btnOutline,
        variant === 'dark' && styles.btnDark,
        disabled && styles.btnDisabled,
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}
    >
      {icon}
      <Text
        style={[
          styles.btnText,
          variant === 'outline' && styles.btnTextOutline,
          variant === 'dark' && styles.btnTextDark,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function OnlineToggle({ online, onToggle }: { online: boolean; onToggle: () => void }) {
  return (
    <Pressable onPress={onToggle} style={[styles.onlinePill, online && styles.onlinePillOn]}>
      <View style={[styles.onlineDot, online && styles.onlineDotOn]} />
      <Text style={[styles.onlineText, online && styles.onlineTextOn]}>
        {online ? 'Online' : 'Offline'}
      </Text>
    </Pressable>
  );
}

export function StatusBadge({ label, tone }: { label: string; tone: 'green' | 'yellow' | 'red' | 'gray' }) {
  const bg =
    tone === 'green' ? OW.greenSoft : tone === 'yellow' ? OW.yellowSoft : tone === 'red' ? OW.redSoft : OW.gray100;
  const fg = tone === 'green' ? OW.green : tone === 'yellow' ? OW.yellowDeep : tone === 'red' ? OW.red : OW.gray500;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function MapPlaceholder({ height = 200, label = 'Map preview' }: { height?: number; label?: string }) {
  return (
    <View style={[styles.mapPh, { height }]}>
      <MaterialCommunityIcons name="map-marker-path" size={32} color={OW.gray400} />
      <Text style={styles.mapPhText}>{label}</Text>
    </View>
  );
}

function CargoThumb({ uri }: { uri?: string }) {
  if (uri) {
    return <Image source={{ uri }} style={styles.cargoThumb} contentFit="cover" />;
  }
  return (
    <View style={[styles.cargoThumb, styles.cargoThumbEmpty]}>
      <MaterialCommunityIcons name="package-variant" size={28} color={OW.gray400} />
    </View>
  );
}

export function LoadCard({
  load,
  onDetails,
  onBid,
  compact,
}: {
  load: OwnerLoad;
  onDetails: () => void;
  onBid: () => void;
  compact?: boolean;
}) {
  const thumbUri = load.images[0];

  if (compact) {
    return (
      <View style={[styles.loadCard, styles.loadCardCompact]}>
        {load.urgent ? (
          <View style={styles.urgent}>
            <Text style={styles.urgentText}>Urgent</Text>
          </View>
        ) : null}
        <Pressable style={styles.loadCompactRow} onPress={onDetails}>
          <CargoThumb uri={thumbUri} />
          <View style={styles.loadCompactBody}>
            <View style={styles.routeRow}>
              <View style={styles.routeDot} />
              <Text style={styles.routeText} numberOfLines={1}>
                {load.pickup}
              </Text>
            </View>
            <View style={styles.routeRow}>
              <View style={[styles.routeDot, styles.routeDotEnd]} />
              <Text style={styles.routeText} numberOfLines={1}>
                {load.dropoff}
              </Text>
            </View>
            <Text style={styles.compactMeta} numberOfLines={1}>
              {load.customerCompany}
            </Text>
            <Text style={styles.compactMeta} numberOfLines={1}>
              Delivery · {load.deliveryDate}
            </Text>
            <Text style={styles.compactMeta} numberOfLines={1}>
              {load.cargoType} · {load.weight} · {load.distance}
            </Text>
            <Text style={styles.compactBudget}>${load.budget}</Text>
          </View>
        </Pressable>
        <View style={styles.loadActions}>
          <Pressable style={styles.loadBtnOutline} onPress={onDetails}>
            <Text style={styles.loadBtnOutlineText}>Details</Text>
          </Pressable>
          <Pressable style={styles.loadBtnPrimary} onPress={onBid}>
            <Text style={styles.loadBtnPrimaryText}>Bid</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Pressable style={styles.loadCard} onPress={onDetails}>
      {load.urgent ? (
        <View style={styles.urgent}>
          <Text style={styles.urgentText}>Urgent</Text>
        </View>
      ) : null}
      {thumbUri ? (
        <Image source={{ uri: thumbUri }} style={styles.loadHero} contentFit="cover" />
      ) : null}
      <View style={styles.routeRow}>
        <View style={styles.routeDot} />
        <Text style={styles.routeText} numberOfLines={1}>
          {load.pickup}
        </Text>
      </View>
      <View style={styles.routeRow}>
        <View style={[styles.routeDot, styles.routeDotEnd]} />
        <Text style={styles.routeText} numberOfLines={1}>
          {load.dropoff}
        </Text>
      </View>
      <View style={styles.loadMetaBlock}>
        <Text style={styles.loadMetaLine}>{load.customerCompany}</Text>
        <Text style={styles.loadMetaLine}>Delivery · {load.deliveryDate}</Text>
        <Text style={styles.loadMetaLine}>
          {load.cargoType} · {load.weight} · {load.distance}
        </Text>
      </View>
      <View style={styles.loadFooter}>
        <View>
          <Text style={styles.budgetLabel}>Budget</Text>
          <Text style={styles.budgetVal}>${load.budget}</Text>
          <Text style={styles.suggested}>Suggested ${load.suggestedPrice}</Text>
        </View>
        <Text style={styles.timePosted}>{load.timePosted}</Text>
      </View>
      <View style={styles.loadActions}>
        <Pressable style={styles.loadBtnOutline} onPress={onDetails}>
          <Text style={styles.loadBtnOutlineText}>Details</Text>
        </Pressable>
        <Pressable style={styles.loadBtnPrimary} onPress={onBid}>
          <Text style={styles.loadBtnPrimaryText}>Place Bid</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export function OwnerSearchBar({ value, onChangeText, placeholder = 'Search loads...' }: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.search}>
      <Feather name="search" size={18} color={OW.gray500} />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={OW.gray400}
      />
    </View>
  );
}

export function FilterChips({ options, selected, onSelect }: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={styles.chips}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => onSelect(opt)}
          style={[styles.chip, selected === opt && styles.chipActive]}
        >
          <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function Avatar({ uri, size = 44 }: { uri?: string | null; size?: number }) {
  if (!uri) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: OW.gray100,
          borderWidth: 2,
          borderColor: OW.gray200,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name="user" size={size * 0.42} color={OW.gray400} />
      </View>
    );
  }
  return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: OW.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerBtn: { width: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontFamily: TQFonts.bold, fontSize: 17, color: OW.black },
  headerSub: { fontFamily: TQFonts.regular, fontSize: 12, color: OW.gray500, marginTop: 2 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: TQRadii.pill,
    paddingHorizontal: 20,
  },
  btnPrimary: { backgroundColor: OW.yellow },
  btnOutline: { backgroundColor: OW.white, borderWidth: 1.5, borderColor: OW.gray200 },
  btnDark: { backgroundColor: OW.black },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontFamily: TQFonts.bold, fontSize: 15, color: OW.black },
  btnTextOutline: { color: OW.black },
  btnTextDark: { color: OW.white },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: TQRadii.pill,
    backgroundColor: OW.gray100,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  onlinePillOn: { backgroundColor: OW.yellowSoft, borderColor: OW.yellow },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: OW.gray400 },
  onlineDotOn: { backgroundColor: OW.green },
  onlineText: { fontFamily: TQFonts.semiBold, fontSize: 13, color: OW.gray500 },
  onlineTextOn: { color: OW.black },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: TQRadii.pill },
  badgeText: { fontFamily: TQFonts.semiBold, fontSize: 11 },
  mapPh: {
    backgroundColor: OW.gray100,
    borderRadius: TQRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: OW.gray200,
    gap: 8,
  },
  mapPhText: { fontFamily: TQFonts.medium, fontSize: 13, color: OW.gray500 },
  loadCard: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: OW.white,
    borderRadius: TQRadii.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: OW.gray200,
    shadowColor: OW.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  loadCardCompact: { marginBottom: 10, width: '100%' },
  loadCompactRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  loadCompactBody: { flex: 1, minWidth: 0 },
  cargoThumb: {
    width: 72,
    height: 72,
    borderRadius: TQRadii.sm,
    backgroundColor: OW.gray100,
  },
  cargoThumbEmpty: { alignItems: 'center', justifyContent: 'center' },
  compactMeta: {
    fontFamily: TQFonts.regular,
    fontSize: 11,
    color: OW.gray500,
    marginTop: 4,
  },
  compactBudget: {
    fontFamily: TQFonts.bold,
    fontSize: 16,
    color: OW.black,
    marginTop: 4,
  },
  loadHero: {
    width: '100%',
    height: 120,
    borderRadius: TQRadii.sm,
    marginBottom: 10,
  },
  urgent: {
    alignSelf: 'flex-start',
    backgroundColor: OW.redSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  urgentText: { fontFamily: TQFonts.bold, fontSize: 10, color: OW.red },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  routeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: OW.yellow },
  routeDotEnd: { backgroundColor: OW.black },
  routeText: { flex: 1, fontFamily: TQFonts.semiBold, fontSize: 14, color: OW.black },
  loadMetaBlock: { marginTop: 4, marginBottom: 12, gap: 4 },
  loadMetaLine: { fontFamily: TQFonts.regular, fontSize: 12, color: OW.gray500, lineHeight: 17 },
  loadMeta: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, marginBottom: 12 },
  loadMetaItem: { fontFamily: TQFonts.regular, fontSize: 12, color: OW.gray500 },
  loadMetaDot: { color: OW.gray400, marginHorizontal: 4 },
  loadFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  budgetLabel: { fontFamily: TQFonts.regular, fontSize: 11, color: OW.gray500 },
  budgetVal: { fontFamily: TQFonts.bold, fontSize: 20, color: OW.black },
  suggested: { fontFamily: TQFonts.medium, fontSize: 11, color: OW.yellowDeep },
  timePosted: { fontFamily: TQFonts.regular, fontSize: 11, color: OW.gray500 },
  loadActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  loadBtnOutline: {
    flex: 1,
    height: 42,
    borderRadius: TQRadii.pill,
    borderWidth: 1.5,
    borderColor: OW.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadBtnOutlineText: { fontFamily: TQFonts.semiBold, fontSize: 13, color: OW.black },
  loadBtnPrimary: {
    flex: 1,
    height: 42,
    borderRadius: TQRadii.pill,
    backgroundColor: OW.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadBtnPrimaryFull: {
    marginTop: 10,
    height: 42,
    borderRadius: TQRadii.pill,
    backgroundColor: OW.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadBtnPrimaryText: { fontFamily: TQFonts.bold, fontSize: 13, color: OW.black },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: OW.white,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: TQRadii.md,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  searchInput: { flex: 1, fontFamily: TQFonts.regular, fontSize: 14, color: OW.black },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginBottom: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: TQRadii.pill,
    backgroundColor: OW.white,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  chipActive: { backgroundColor: OW.yellow, borderColor: OW.yellow },
  chipText: { fontFamily: TQFonts.medium, fontSize: 12, color: OW.gray500 },
  chipTextActive: { fontFamily: TQFonts.bold, color: OW.black },
});
