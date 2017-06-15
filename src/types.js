/* @flow */

// Number is the opaque type returned by require('./image.jpg')
export type Image = number | { uri: string };
export type Region = {
  top: number,
  left: number,
  bottom: number,
  right: number,
};

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
  [key: ColorProfile]: Swatch,
};

export type Options = {
  region?: Region,
  maximumColorCount?: number,
  type?: ColorProfile,
  types?: Array<ColorProfile>,
};
