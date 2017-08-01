/* eslint-env jest */

import { createMaterialPalette } from '../';

describe('reactNativeMaterialPalette', () => {
  it('should return argument', () => {
    expect(typeof createMaterialPalette).toBe('function');
  });
});
