/* @flow */

import { NativeModules } from 'react-native';
import resolveAssetSource
  from 'react-native/Libraries/Image/resolveAssetSource';
import isEqual from 'lodash/isEqual';
import Background from './Background';
import Text from './Text';
import { defaultOptions, nullSwatch } from './constants/defaults';
import type { Image, PaletteInstance, Options, ColorProfile } from './types';

import PaletteProvider from './PaletteProvider';
import withPalette from './withPalette';

export const MaterialPaletteProvider = PaletteProvider;
export const withMaterialPalette = withPalette;

/** API */

type Namespace = {
  create: (image: Image, options: ?Options) => Promise<PaletteInstance>,
  Background: Class<React$Component<void, Options, void>>,
  Text: Class<React$Component<void, Options, void>>,
  PaletteProvider: Class<React$Component<void, *, *>>,
  withPalette: (
    mapPaletteToStyle: ?(palette: PaletteInstance) => {
      [key: string]: mixed,
    },
  ) => (WrappedComponent: ReactClass<*>) => Class<React$Component<void, *, *>>,
};

const namespace: Namespace = {
  async create(
    image: Image,
    options: ?Options = defaultOptions,
  ): Promise<PaletteInstance> {
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
      if (isEqual(paletteInstance[profile], nullSwatch)) {
        paletteInstance[profile] = null;
      }
    });
    return paletteInstance;
  },

  Background,
  Text,
  PaletteProvider: MaterialPaletteProvider,
  withPalette: withMaterialPalette,
};

export default namespace;
