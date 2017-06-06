/* eslint-env jest */

import MaterialPalette from '../';

describe('reactNativeMaterialPalette', () => {
  it('should return argument', () => {
    expect(typeof MaterialPalette.create).toBe('function');
  });
});
