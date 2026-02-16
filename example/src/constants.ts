import {
  type PaletteResult,
  type PaletteTarget,
} from 'react-native-material-palette';

export const SPACING = 4;
export const PADDING = SPACING * 5;
export const GAP = SPACING * 3;
export const ROUNDNESS = SPACING * 4;

export const HERO_IMAGE_HEIGHT = SPACING * 55;

export const STORY_IMAGE_WIDTH = SPACING * 28;
export const STORY_IMAGE_HEIGHT = SPACING * 33;

export const DOT_SIZE = SPACING * 1.5;
export const DISCOVER_CARD_WIDTH_RATIO = 0.38;

export const COLORS = {
  background: '#FAFAFA',
  text: '#1A1A1A',
  subtitle: '#666',
  fallbackDark: '#2A2A2A',
  fallbackDarkTitle: '#FFFFFF',
  fallbackDarkBody: '#CCCCCC',
  fallbackLight: '#F0F0F0',
  fallbackLightTitle: '#1A1A1A',
  fallbackLightBody: '#555555',
};

export const FALLBACK_DARK = {
  color: COLORS.fallbackDark,
  titleTextColor: COLORS.fallbackDarkTitle,
  bodyTextColor: COLORS.fallbackDarkBody,
};

export const FALLBACK_LIGHT = {
  color: COLORS.fallbackLight,
  titleTextColor: COLORS.fallbackLightTitle,
  bodyTextColor: COLORS.fallbackLightBody,
};

export const PALETTE_TYPES: (keyof PaletteResult)[] = [
  'vibrant',
  'lightVibrant',
  'darkVibrant',
  'muted',
  'lightMuted',
  'darkMuted',
];

export const LIGHT_BACKGROUND_TARGET: PaletteTarget = {
  targetLightness: 0.75,
  minimumLightness: 0.65,
  maximumLightness: 1.0,
  targetSaturation: 0.1,
  minimumSaturation: 0.0,
  maximumSaturation: 0.6,
  lightnessWeight: 0.5,
  saturationWeight: 0.1,
  populationWeight: 0.5,
  exclusive: false,
};
