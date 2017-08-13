/* eslint-disable import/first */
jest.mock('../validateCreatePaletteArgs');

import validateCreatePalette from '../validateCreatePalette';
import { defaultOptions } from '../../constants/defaults';
import {
  validateType,
  validateImage,
  validateMaximumColorCount,
  validateRegion,
  validateOptionsKeys,
} from '../validateCreatePaletteArgs';

const VALID_IMAGE = { uri: 'https://something.image.jpg' };

describe('validateCreatePalette', () => {
  beforeEach(() => {
    validateType.mockReset();
    validateImage.mockReset();
    validateMaximumColorCount.mockReset();
    validateRegion.mockReset();
    validateOptionsKeys.mockReset();
  });

  it('should run all validators if all args are passed', () => {
    expect(() =>
      validateCreatePalette(VALID_IMAGE, defaultOptions),
    ).not.toThrow();

    validateCreatePalette(VALID_IMAGE, defaultOptions);

    expect(validateImage).toHaveBeenCalledWith(VALID_IMAGE);
    expect(validateOptionsKeys).toHaveBeenCalledWith(defaultOptions);
    expect(validateType).toHaveBeenCalledWith(defaultOptions.type);
    expect(validateRegion).toHaveBeenCalledWith(defaultOptions.region);
    expect(validateMaximumColorCount).toHaveBeenCalledWith(
      defaultOptions.maximumColorCount,
    );
  });

  it('should not run options validators if options are not provided', () => {
    expect(() => validateCreatePalette(VALID_IMAGE, {})).not.toThrow();
    validateCreatePalette(VALID_IMAGE, {});
    expect(validateImage).toHaveBeenCalledWith(VALID_IMAGE);
    expect(validateOptionsKeys).not.toHaveBeenCalled();
    expect(validateType).not.toHaveBeenCalled();
    expect(validateRegion).not.toHaveBeenCalled();
    expect(validateMaximumColorCount).not.toHaveBeenCalled();
  });
});
