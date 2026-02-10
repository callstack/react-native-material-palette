import type * as implementation from './implementation.android';

import { Text, View } from 'react-native';

export const createPalette: typeof implementation.createPalette = () => {
  return Promise.reject(new Error('Not implemented on this platform'));
};

export const createPaletteForTarget: typeof implementation.createPaletteForTarget =
  () => {
    return Promise.reject(new Error('Not implemented on this platform'));
  };

export const usePaletteSwatch: typeof implementation.usePaletteSwatch = () => {
  return undefined;
};

const PaletteView: typeof implementation.Palette.View = (props) => {
  return <View {...props} />;
};

const PaletteText: typeof implementation.Palette.Text = (props) => {
  return <Text {...props} />;
};

export const Palette: typeof implementation.Palette = {
  View: PaletteView,
  Text: PaletteText,
};

export type {
  PaletteOptions,
  PaletteTarget,
  PaletteResult,
  PaletteSwatch,
} from './types';

export type { PaletteViewProps, PaletteTextProps } from './PaletteComponents';
