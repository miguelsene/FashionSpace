/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#5f81a5';
const tintColorDark = '#5f81a5';

export const Colors = {
  light: {
    text: '#000000',
    background: '#f4eddc',
    tint: tintColorLight,
    icon: '#5f81a5',
    tabIconDefault: '#5f81a5',
    tabIconSelected: '#0f2c47',
    primary: '#0f2c47',
    secondary: '#5f81a5',
    accent: '#5f81a5',
    card: '#FFFFFF',
    border: '#d4c9b8',
  },
  dark: {
    text: '#f4eddc',
    background: '#0f2c47',
    tint: tintColorDark,
    icon: '#5f81a5',
    tabIconDefault: '#5f81a5',
    tabIconSelected: '#f4eddc',
    primary: '#5f81a5',
    secondary: '#0f2c47',
    accent: '#5f81a5',
    card: '#1a3a5a',
    border: '#5f81a5',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
