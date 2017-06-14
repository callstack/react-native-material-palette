/* @flow */

import { NativeModules } from 'react-native';
import resolveAssetSource
  from 'react-native/Libraries/Image/resolveAssetSource';
import isEqual from 'lodash/isEqual';
import Background from './Background';
import Text from './Text';
import type {
  Image,
  PaletteInstance,
  Options,
  ColorProfile,
  Swatch,
} from './types';

const nullSwatch = {
  population: 0,
  color: '#000000',
  bodyTextColor: '#000000',
  titleTextColor: '#000000',
};

const doesSwatchExist = (swatch: Swatch): boolean =>
  !isEqual(swatch, nullSwatch);

function getColor(
  color: ColorProfile,
  defaultColor: string = '#FFFFFF',
): Promise<string> {
  return NativeModules.MaterialPalette.getColor(color, defaultColor);
}

async function getSwatch(color: ColorProfile): Promise<Swatch> {
  const swatch = await NativeModules.MaterialPalette.getSwatch(color);
  return doesSwatchExist(swatch) ? swatch : nullSwatch;
}

/** API */
export default class MaterialPalette {
  static async create(image: Image): Promise<PaletteInstance> {
    const source = resolveAssetSource(image);
    await NativeModules.MaterialPalette.createMaterialPalette(source);
    return {
      getColor,
      getSwatch,
    };
  }

  static Background: Class<React$Component<void, Options, void>> = Background;
  static Text: Class<React$Component<void, Options, void>> = Text;
}
