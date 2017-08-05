/* eslint-disable import/first */
jest.mock('react-native', () => ({
  NativeModules: {
    MaterialPalette: {
      createMaterialPalette: jest.fn(),
    },
  },
}));
jest.mock('react-native/Libraries/Image/resolveAssetSource', () => jest.fn());
jest.mock('../utils/validateCreatePalette', () => jest.fn());

import { NativeModules } from 'react-native';
import resolveAssetSource
  from 'react-native/Libraries/Image/resolveAssetSource';
import createPalette from '../createMaterialPalette';
import validateCreatePalette from '../utils/validateCreatePalette';
import {
  defaultLightSwatch,
  defaultOptions,
  defaultSwatches,
} from '../constants/defaults';

describe('createMaterialPalette', () => {
  beforeEach(() => {
    NativeModules.MaterialPalette.createMaterialPalette.mockReset();
    resolveAssetSource.mockReset();
  });

  it('should create palette with default options if no options are provided', () => {
    NativeModules.MaterialPalette.createMaterialPalette.mockImplementation(() =>
      Promise.resolve({
        vibrant: defaultLightSwatch,
      }));
    resolveAssetSource.mockImplementation(() => `file://asset.jpg`);

    return createPalette(0).then(() => {
      expect(
        NativeModules.MaterialPalette.createMaterialPalette,
      ).toHaveBeenCalledWith(`file://asset.jpg`, {
        type: ['vibrant'],
        region: defaultOptions.region,
        maximumColorCount: defaultOptions.maximumColorCount,
      });
    });
  });

  it('should call all the proper methods and provide null for the profiles not available', () => {
    NativeModules.MaterialPalette.createMaterialPalette.mockImplementation(() =>
      Promise.resolve({
        lightVibrant: defaultLightSwatch,
        darkMuted: {
          color: 'green',
          population: 20,
          bodyTextColor: 'red',
          titleTextColor: 'red',
        },
      }));
    resolveAssetSource.mockImplementation(() => `file://asset.jpg`);

    return createPalette(0, {
      type: ['lightVibrant', 'darkMuted'],
    }).then(palette => {
      expect(validateCreatePalette).toHaveBeenCalledWith(0, {
        type: ['lightVibrant', 'darkMuted'],
      });
      expect(resolveAssetSource).toHaveBeenCalledWith(0);
      expect(
        NativeModules.MaterialPalette.createMaterialPalette,
      ).toHaveBeenCalledWith(`file://asset.jpg`, {
        type: ['lightVibrant', 'darkMuted'],
        region: defaultOptions.region,
        maximumColorCount: defaultOptions.maximumColorCount,
      });
      expect(palette.lightVibrant).toEqual(defaultSwatches.lightVibrant);
      expect(palette.darkMuted).toEqual({
        color: 'green',
        population: 20,
        bodyTextColor: 'red',
        titleTextColor: 'red',
      });
    });
  });

  describe('Merge with defaults', () => {
    it('should merge palette with globals when custom defaults are not provided, for the types specified', async () => {
      NativeModules.MaterialPalette.createMaterialPalette.mockImplementation(
        () =>
          Promise.resolve({
            vibrant: {
              color: 'green',
              bodyTextColor: 'red',
              titleTextColor: 'red',
              population: 20,
            },
            muted: null,
          }),
      );

      expect(
        await createPalette(0, { types: ['vibrant', 'muted'] }, undefined),
      ).toEqual({
        vibrant: {
          color: 'green',
          bodyTextColor: 'red',
          titleTextColor: 'red',
          population: 20,
        },
        muted: defaultSwatches.muted,
      });
    });

    it('should merge palette with globals when custom defaults contain a wrong profile, for the types specified', async () => {
      NativeModules.MaterialPalette.createMaterialPalette.mockImplementation(
        () =>
          Promise.resolve({
            vibrant: defaultSwatches.vibrant,
          }),
      );

      expect(
        await createPalette(
          0,
          { type: ['vibrant', 'muted'] },
          { darkMuted: null },
        ),
      ).toEqual({
        vibrant: defaultSwatches.vibrant,
        darkMuted: defaultSwatches.darkMuted,
      });
    });

    it('should merge palette with both globals and custom defaults, for the types specified', async () => {
      NativeModules.MaterialPalette.createMaterialPalette.mockImplementation(
        () =>
          Promise.resolve({
            muted: {
              color: 'green',
              bodyTextColor: 'red',
              titleTextColor: 'red',
              population: 20,
            },
            darkMuted: {
              color: 'yellow',
              bodyTextColor: 'blue',
              titleTextColor: 'blue',
              population: 40,
            },
            lightVibrant: null,
            darkVibrant: null,
          }),
      );

      expect(
        await createPalette(
          0,
          { type: ['muted', 'darkMuted', 'lightVibrant', 'darkVibrant'] },
          {
            darkMuted: {
              color: 'orange',
              bodyTextColor: 'purple',
              titleTextColor: 'purple',
            },
            lightVibrant: {
              color: 'orange',
              bodyTextColor: 'purple',
              titleTextColor: 'purple',
            },
          },
        ),
      ).toEqual({
        muted: {
          color: 'green',
          bodyTextColor: 'red',
          titleTextColor: 'red',
          population: 20,
        },
        darkMuted: {
          color: 'yellow',
          bodyTextColor: 'blue',
          titleTextColor: 'blue',
          population: 40,
        },
        lightVibrant: {
          color: 'orange',
          bodyTextColor: 'purple',
          titleTextColor: 'purple',
          population: 0,
        },
        darkVibrant: defaultSwatches.darkVibrant,
      });
    });
  });
});
