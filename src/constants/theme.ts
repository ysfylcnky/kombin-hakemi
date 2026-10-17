import type { TextStyle } from 'react-native';

export const colors = {
  light: {
    bg: '#F7F3EC',
    surface: '#FFFDF9',
    text: '#1E1A1D',
    textMuted: '#6A615E',
    primary: '#7A1F35',
    border: '#E4DCD2',
    levelWeak: '#A8432A',
    levelDeveloping: '#8A6510',
    levelGood: '#5A6A28',
    levelVeryGood: '#8C2B44',
    levelFlawless: '#5E1426',
  },
  dark: {
    bg: '#17131A',
    surface: '#221C25',
    text: '#F4EEE6',
    textMuted: '#ACA39C',
    primary: '#D88A9B',
    border: '#352C35',
    levelWeak: '#E58066',
    levelDeveloping: '#DDB04F',
    levelGood: '#AFBD6E',
    levelVeryGood: '#E08EA0',
    levelFlawless: '#F2B8C4',
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
