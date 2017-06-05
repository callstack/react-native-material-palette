/* @flow */

export type Image = { uri: string };

export type ColorProfile =
  | 'dominant'
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
  getSwatch: (ColorProfile) => Swatch,
};

export type Options = {
  region?: { top: number, left: number, bottom: number, right: number },
  maximumColorCount?: number,
  type?:
    | 'dominant'
    | 'muted'
    | 'vibrant'
    | 'darkMuted'
    | 'darkVibrant'
    | 'lightMuted'
    | 'lightVibrant',
};
