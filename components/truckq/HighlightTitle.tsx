import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TQ, TQFonts } from '@/constants/truckq-design';

type Part = { text: string; highlight?: boolean };

type Props = {
  parts: Part[];
};

export function HighlightTitle({ parts }: Props) {
  return (
    <Text style={styles.title}>
      {parts.map((p, i) => (
        <Text key={i} style={p.highlight ? styles.highlight : styles.plain}>
          {p.text}
        </Text>
      ))}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: TQFonts.bold,
    fontSize: 26,
    lineHeight: 34,
    color: TQ.black,
    letterSpacing: -0.5,
  },
  plain: {
    fontFamily: TQFonts.bold,
    color: TQ.black,
  },
  highlight: {
    fontFamily: TQFonts.bold,
    color: TQ.yellow,
  },
});
