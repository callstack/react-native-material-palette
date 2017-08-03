/* @flow */

import {
  validateImage,
  validateOptionsKeys,
  validateType,
  validateMaximumColorCount,
  validateRegion,
} from './validateCreatePaletteArgs';
import type { Image, Options } from '../types';

export default function validateCreatePalette(image: Image, options: Options) {
  validateImage(image);
  if (Object.keys(options).length) {
    validateOptionsKeys(options);
  }
  if (options.type) {
    validateType(options.type);
  }
  if (options.maximumColorCount) {
    validateMaximumColorCount(options.maximumColorCount);
  }
  if (options.region) {
    validateRegion(options.region);
  }
}
