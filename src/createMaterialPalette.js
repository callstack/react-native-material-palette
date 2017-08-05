/* @flow */

import { NativeModules } from 'react-native';
import resolveAssetSource
  from 'react-native/Libraries/Image/resolveAssetSource';
import isEqual from 'lodash/isEqual';
import {
  defaultOptions,
  defaultLightSwatch,
  defaultSwatches,
} from './constants/defaults';
import validateCreatePalette from './utils/validateCreatePalette';
import type {
  Image,
  PaletteInstance,
  Options,
  ColorProfile,
  PaletteDefaults,
} from './types';

function mergeWithDefaults(
  palette: PaletteInstance,
  customDefaults: PaletteDefaults = {},
) {
  const globalDefaultsForTypesProvided = ((Object.keys(
    palette,
  ): any): ColorProfile[]).reduce(
    (acc, profile) => ({
      ...acc,
      [profile]: defaultSwatches[profile],
    }),
    {},
  );

  const defaults = {
    ...globalDefaultsForTypesProvided,
    ...((Object.keys(customDefaults): any): ColorProfile[]).reduce(
      (acc: *, profile: ColorProfile) => ({
        ...acc,
        [profile]: {
          ...(customDefaults && customDefaults[profile]
            ? customDefaults[profile]
            : defaultSwatches[profile]),
          population: 0,
        },
      }),
      {},
    ),
  };
  return {
    ...defaults,
    ...((Object.keys(palette): any): ColorProfile[])
      .filter((profile: ColorProfile) => !!palette[profile]) // Stripping out unavailable profiles
      .reduce(
        (acc: *, profile: ColorProfile) => ({
          ...acc,
          [profile]: palette[profile],
        }),
        {},
      ),
  };
}

export default (async function createMaterialPalette(
  image: Image,
  options?: Options = {},
  defaults?: ?PaletteDefaults,
): Promise<PaletteInstance> {
  validateCreatePalette(image, options);
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
  return mergeWithDefaults(paletteInstance, defaults);
});
