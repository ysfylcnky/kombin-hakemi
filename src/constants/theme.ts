import type { TextStyle } from 'react-native';

export const colors = {
  light: {
    bg: '#EFE6D8',
    surface: '#F8F2E8',
    text: '#2B1E16',
    textMuted: '#6B5848',
    primary: '#8A5A2E',
    border: '#DCCDB8',
    levelWeak: '#A3422A',
    levelDeveloping: '#7E5B0C',
    levelGood: '#586620',
    levelVeryGood: '#3F6B3A',
    levelFlawless: '#2A5440',
  },
  dark: {
    bg: '#1C1511',
    surface: '#271E18',
    text: '#EFE6D8',
    textMuted: '#B3A391',
    primary: '#C9965F',
    border: '#3A2E25',
    levelWeak: '#E3826A',
    levelDeveloping: '#D9AE52',
    levelGood: '#B4BE6C',
    levelVeryGood: '#8FC27F',
    levelFlawless: '#6CCB9C',
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
