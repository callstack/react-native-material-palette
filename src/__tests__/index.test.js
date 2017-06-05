/* eslint-env jest */

const MaterialPalette = require('../');

describe('reactNativeMaterialPalette', () => {
  it('should return argument', () => {
    expect(typeof MaterialPalette.create).toBe('function');
  });
});
