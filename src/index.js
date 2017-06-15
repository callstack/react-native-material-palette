/* @flow */

import { NativeModules } from 'react-native';
import resolveAssetSource
  from 'react-native/Libraries/Image/resolveAssetSource';
import isEqual from 'lodash/isEqual';
import Background from './Background';
import Text from './Text';
import { defaultOptions, nullSwatch } from './constants/defaults';
import type { Image, PaletteInstance, Options, ColorProfile } from './types';

/** API */
export default class MaterialPalette {
  static async create(
    image: Image,
    options: Options = defaultOptions,
  ): Promise<PaletteInstance> {
    const {
      region = defaultOptions.region,
      maximumColorCount = defaultOptions.maximumColorCount,
      type = defaultOptions.type,
      types = defaultOptions.types,
    } = options;

    const source = resolveAssetSource(image);

    const paletteInstance = await NativeModules.MaterialPalette.createMaterialPalette(
      source,
      {
        region,
        maximumColorCount,
        type,
        types,
      },
    );
    Object.keys(paletteInstance).forEach((profile: ColorProfile) => {
      if (isEqual(paletteInstance[profile], nullSwatch)) {
        paletteInstance[profile] = null;
      }
    });
    return paletteInstance;
  }

  static Background: Class<React$Component<void, Options, void>> = Background;
  static Text: Class<React$Component<void, Options, void>> = Text;
}
