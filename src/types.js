/* @flow */

import { validColorProfiles } from './constants/defaults';

// Number is the opaque type returned by require('./image.jpg')
export type Image = number | { uri: string };
export type Region = {
  top: number,
  left: number,
  bottom: number,
  right: number,
};

export type ColorProfile = $Keys<typeof validColorProfiles>;
export type Swatch = {
  population: number, // number of pixels
  color: string, // color for swatch,
  bodyTextColor: string, // appropriate color to use for any 'body' text
  titleTextColor: string, // appropriate color to use for any 'title' text
};

export type DefaultSwatch = {
  color: string,
  bodyTextColor: string,
  titleTextColor: string,
};

export type PaletteDefaults = {
  [key: ColorProfile]: DefaultSwatch,
};

export type PaletteInstance = {
  [key: ColorProfile]: ?Swatch,
};

export type Options = {
  region?: Region,
  maximumColorCount?: number,
  type?: ColorProfile | Array<ColorProfile>,
};
