/* @flow */

import { NativeModules } from 'react-native';
import Background from './Background';
import Text from './Text';
import type { Image, PaletteInstance, Options } from './types';

/** API */
module.exports = class MaterialPalette {
  static create(image: Image): Promise<PaletteInstance> {
    return NativeModules.MaterialPalette.createMaterialPalette(image);
  }

  static Background: Class<React$Component<void, Options, void>> = Background;
  static Text: Class<React$Component<void, Options, void>> = Text;
};
