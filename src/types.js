/* @flow */

// Number is the opaque type returned by require('./image.jpg')
export type Image = number | { uri: string };

export type ColorProfile =
  | 'muted'
  | 'vibrant'
  | 'darkMuted'
  | 'darkVibrant'
  | 'lightMuted'
  | 'lightVibrant';

export type Swatch = {
  population: number, // number of pixels
  color: string, // color for swatch,
  bodyTextColor: string, // appropriate color to use for any 'body' text
  titleTextColor: string, // appropriate color to use for any 'title' text
};

export type PaletteInstance = {
  getColor: (ColorProfile) => string,
  // getSwatch: (ColorProfile) => Swatch,
};

export type Options = {
  region?: { top: number, left: number, bottom: number, right: number },
  maximumColorCount?: number,
  type?: ColorProfile,
};
