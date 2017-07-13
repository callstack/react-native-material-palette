/* @flow */

import type { Region, Options, Swatch } from '../types';

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

export const nullSwatch: Swatch = {
  population: 0,
  color: '#000000',
  bodyTextColor: '#000000',
  titleTextColor: '#000000',
};
