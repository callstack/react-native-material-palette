/* @flow */

import { NativeModules } from 'react-native';
import Background from './Background';
import Text from './Text';
import type { Uri, PaletteInstance, Options } from './types';

/** API */
export default class MaterialPalette {
  static async create(uri: Uri): Promise<PaletteInstance> {
    const resultFromNative = await NativeModules.MaterialPalette.createMaterialPalette(
      uri,
    );
    return Promise.resolve(resultFromNative);
  }

  static Background: Class<React$Component<void, Options, void>> = Background;
  static Text: Class<React$Component<void, Options, void>> = Text;
}
