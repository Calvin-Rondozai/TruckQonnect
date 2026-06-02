import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { BoxImage } from '@/components/truckq/BoxImage';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

export type ShipmentCardData = {
  code: string;
  companyName: string;
  deliveryDate: string;
  route: string;
  status?: string;
  subtitle?: string;
  amount?: string;
};

type Props = {
  data: ShipmentCardData;
  onPress?: () => void;
  boxWidth?: number;
  style?: StyleProp<ViewStyle>;
  footer?: React.ReactNode;
};

function MetaLine({ icon, text }: { icon: React.ComponentProps<typeof Feather>['name']; text: string }) {
  return (
    <View style={styles.metaLine}>
      <Feather name={icon} size={14} color={TQ.gray500} />
      <Text style={styles.metaText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

export function ShipmentCard({ data, onPress, boxWidth = 72, style, footer }: Props) {
  const content = (
    <>
      <View style={styles.top}>
        <View style={styles.head}>
          {data.status ? (
            <View
              style={[
                styles.statusPill,
                data.status.toLowerCase() === 'delivered' && { backgroundColor: TQ.greenSoft },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  data.status.toLowerCase() === 'delivered' && { color: TQ.green },
                ]}
              >
                {data.status}
              </Text>
            </View>
          ) : null}
          <Text style={styles.code}>{data.code}</Text>
        </View>
        <BoxImage width={boxWidth} />
      </View>

      <View style={styles.metaBlock}>
        <MetaLine icon="briefcase" text={data.companyName} />
        <MetaLine icon="calendar" text={data.deliveryDate} />
        <MetaLine icon="map-pin" text={data.route} />
        {data.subtitle ? <MetaLine icon="package" text={data.subtitle} /> : null}
        {data.amount ? <MetaLine icon="dollar-sign" text={data.amount} /> : null}
      </View>

      {footer}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && { opacity: 0.94 }, style]}
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: TQ.white,
    borderRadius: TQRadii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: TQ.gray200,
    gap: 12,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  head: { flex: 1, gap: 6 },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: TQRadii.pill,
    backgroundColor: TQ.yellowSoft,
  },
  statusText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 11,
    color: TQ.black,
  },
  code: {
    fontFamily: TQFonts.bold,
    fontSize: 17,
    color: TQ.ink,
    letterSpacing: -0.2,
  },
  metaBlock: { gap: 8 },
  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    flex: 1,
    fontFamily: TQFonts.regular,
    fontSize: 13,
    color: TQ.gray600,
    lineHeight: 18,
  },
});
