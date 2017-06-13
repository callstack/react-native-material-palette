/* @flow */

import { NativeModules } from 'react-native';
import resolveAssetSource
  from 'react-native/Libraries/Image/resolveAssetSource';
import Background from './Background';
import Text from './Text';
import type { Image, PaletteInstance, Options } from './types';

/** API */
export default class MaterialPalette {
  static async create(image: Image): Promise<PaletteInstance> {
    const source = resolveAssetSource(image);
    return NativeModules.MaterialPalette.createMaterialPalette(source);
  }

  static Background: Class<React$Component<void, Options, void>> = Background;
  static Text: Class<React$Component<void, Options, void>> = Text;
}
