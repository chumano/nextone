import {configureFonts, DefaultTheme} from 'react-native-paper';

const fontConfig = {
  ios: {
    black: {
      fontFamily: 'Inter',
      fontWeight: '900' as '900',
    },
    bold: {
      fontFamily: 'Inter',
      fontWeight: '700' as '700',
    },
    semibold: {
      fontFamily: 'Inter',
      fontWeight: '600' as '600',
    },
    medium: {
      fontFamily: 'Inter',
      fontWeight: '500' as '500',
    },
    regular: {
      fontFamily: 'Inter',
      fontWeight: 'normal' as 'normal',
    },
    light: {
      fontFamily: 'Inter',
      fontWeight: '300' as '300',
    },
    thin: {
      fontFamily: 'Inter',
      fontWeight: '100' as '100',
    },
  },
  android: {
    black: {
      fontFamily: 'Inter',
      fontWeight: '900' as '900',
    },
    bold: {
      fontFamily: 'Inter',
      fontWeight: '700' as '700',
    },
    semibold: {
      fontFamily: 'Inter',
      fontWeight: '600' as '600',
    },
    medium: {
      fontFamily: 'Inter',
      fontWeight: '500' as '500',
    },
    regular: {
      fontFamily: 'Inter',
      fontWeight: 'normal' as 'normal',
    },
    light: {
      fontFamily: 'Inter',
      fontWeight: '300' as '300',
    },
    thin: {
      fontFamily: 'Inter',
      fontWeight: '100' as '100',
    },
  },
};

export const APP_THEME = {
  ...DefaultTheme,
  rounded: 8,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    primary: '#fcfcfc',
    accent: '#6b59cc',
    black: '#0c0c0c',
    link: '#007fff',
    red: '#ff2d54',
    green: '#34c759',
    yellow: '#ffcc00',
  },
  spacing: {
    padding: 21,
    between_component: 14,
  },
};
