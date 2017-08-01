/* @flow */

import { NativeModules } from 'react-native';
import resolveAssetSource
  from 'react-native/Libraries/Image/resolveAssetSource';
import isEqual from 'lodash/isEqual';
import { defaultOptions, defaultLightSwatch } from './constants/defaults';
import validate from './utils/validate';
import type { Image, PaletteInstance, Options, ColorProfile } from './types';

export default (async function createMaterialPalette(
  image: Image,
  options?: Options = defaultOptions,
): Promise<PaletteInstance> {
  validate(image, options);
  const {
    region,
    maximumColorCount,
    type,
  } = { ...defaultOptions, ...options };

  const source = resolveAssetSource(image);

  const paletteInstance = await NativeModules.MaterialPalette.createMaterialPalette(
    source,
    {
      region,
      maximumColorCount,
      type: typeof type === 'string' ? [type] : type,
    },
  );
  Object.keys(paletteInstance).forEach((profile: ColorProfile) => {
    if (isEqual(paletteInstance[profile], defaultLightSwatch)) {
      paletteInstance[profile] = null;
    }
  });
  return paletteInstance;
});
