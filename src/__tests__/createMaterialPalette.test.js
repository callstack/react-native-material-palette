/* eslint-disable import/first */
jest.mock('react-native', () => ({
  NativeModules: {
    MaterialPalette: {
      createMaterialPalette: jest.fn(),
    },
  },
}));
jest.mock('react-native/Libraries/Image/resolveAssetSource', () => jest.fn());
jest.mock('../utils/validate', () => jest.fn());

import { NativeModules } from 'react-native';
import resolveAssetSource
  from 'react-native/Libraries/Image/resolveAssetSource';
import createPalette from '../createMaterialPalette';
import { defaultLightSwatch } from '../constants/defaults';

describe('createMaterialPalette', () => {
  beforeEach(() => {
    NativeModules.MaterialPalette.createMaterialPalette.mockReset();
    resolveAssetSource.mockReset();
  });

  it('should provide null for the profiles not available', () => {
    NativeModules.MaterialPalette.createMaterialPalette.mockImplementation(() =>
      Promise.resolve({
        vibrant: defaultLightSwatch,
        darkMuted: {
          color: 'green',
          population: 20,
          bodyTextColor: 'red',
          titleTextColor: 'red',
        },
      }));

    return createPalette({
      image: 0,
    }).then(palette => {
      expect(palette.vibrant).toBeNull();
      expect(palette.darkMuted).toEqual({
        color: 'green',
        population: 20,
        bodyTextColor: 'red',
        titleTextColor: 'red',
      });
    });
  });
});
