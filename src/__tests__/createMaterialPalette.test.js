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
import { defaultLightSwatch, defaultOptions } from '../constants/defaults';

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
      expect(palette.lightVibrant).toBeNull();
      expect(palette.darkMuted).toEqual({
        color: 'green',
        population: 20,
        bodyTextColor: 'red',
        titleTextColor: 'red',
      });
    });
  });
});
