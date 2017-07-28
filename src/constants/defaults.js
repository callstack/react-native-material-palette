/* @flow */

import type { Region, Options, Swatch } from '../types';

const defaultVibrant = '#757575';
const defaultLightVibrant = '#E0E0E0';
const defaultDarkVibrant = '#212121';
const defaultMuted = '#9E9E9E';
const defaultLightMuted = '#BDBDBD';
const defaultDarkMuted = '#616161';

export const defaultRegion: Region = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const defaultOptions: Options = {
  region: defaultRegion,
  maximumColorCount: 16,
  type: 'vibrant',
};

export const defaultLightSwatch: Swatch = {
  population: 0,
  color: '#000000',
  bodyTextColor: '#000000',
  titleTextColor: '#000000',
};

const defaultDarkSwatch: Swatch = {
  population: 0,
  color: '#000000',
  bodyTextColor: '#FFFFFF',
  titleTextColor: '#FFFFFF',
};

export const defaultSwatch = {
  vibrant: { ...defaultDarkSwatch, color: defaultVibrant },
  lightVibrant: { ...defaultLightSwatch, color: defaultLightVibrant },
  darkVibrant: { ...defaultLightSwatch, color: defaultDarkVibrant },
  muted: { ...defaultDarkSwatch, color: defaultMuted },
  lightMuted: { ...defaultLightSwatch, color: defaultLightMuted },
  darkMuted: { ...defaultLightSwatch, color: defaultDarkMuted },
};
