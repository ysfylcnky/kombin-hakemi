import type { TextStyle } from 'react-native';

export const colors = {
  light: {
    bg: '#F6F3EA',
    surface: '#FFFFFF',
    text: '#14201A',
    textMuted: '#5B6B62',
    primary: '#1F7A4D',
    cardRed: '#D7263D',
    cardYellow: '#F2B705',
    cardGreen: '#2E9E5B',
    golden: '#C9A227',
    border: '#E2DDD0',
  },
  dark: {
    bg: '#0F1A14',
    surface: '#18261E',
    text: '#F3EEDF',
    textMuted: '#A7B3AA',
    primary: '#3DBE7E',
    cardRed: '#FF4D5E',
    cardYellow: '#FFD23F',
    cardGreen: '#4CD683',
    golden: '#E6C25A',
    border: '#26372D',
  },
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 14, lg: 22, pill: 999 };

// Each weight is a separate font file, so weight is chosen via fontFamily, not fontWeight.
export const typography = {
  display: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 32, lineHeight: 38 },
  title: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 22, lineHeight: 28 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18 },
  score: { fontFamily: 'Inter_900Black', fontSize: 72, fontVariant: ['tabular-nums'] },
} satisfies Record<string, TextStyle>;
