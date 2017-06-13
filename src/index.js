/* @flow */

import { NativeModules } from 'react-native';
import resolveAssetSource
  from 'react-native/Libraries/Image/resolveAssetSource';
import Background from './Background';
import Text from './Text';
import type { Image, PaletteInstance, Options, ColorProfile } from './types';

function getColor(
  color: ColorProfile,
  defaultColor: string = '#FFFFFF',
): string {
  return NativeModules.MaterialPalette.getColor(color, defaultColor);
}

/** API */
export default class MaterialPalette {
  static async create(image: Image): Promise<PaletteInstance> {
    const source = resolveAssetSource(image);
    await NativeModules.MaterialPalette.createMaterialPalette(source);
    return Promise.resolve({
      getColor,
    });
  }

  static Background: Class<React$Component<void, Options, void>> = Background;
  static Text: Class<React$Component<void, Options, void>> = Text;
}
