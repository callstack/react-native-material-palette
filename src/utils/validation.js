/**
 * Created by rauliyohmc on 24/07/2017.
 * @flow
 */

import type { Image, Options, Region, ColorProfile } from '../types';

export const INVALID_IMAGE_MESSAGE = 'Invalid image param, you should either require a local asset, or provide an external URI';
export const INVALID_OPTIONS_MESSAGE = 'Invalid options param, please refer to the API documentation';
export const INVALID_POSITIVE_INTEGER_MESSAGE = 'Invalid maximumColorCount param, it should be a positive integer';
export const INVALID_TYPE_MESSAGE = 'Invalid type, it should be a string';

export default function validation(image: Image, options: Options) {
  validateImage(image);
  validateOptions(options);
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

export function validateImage(image: Image) {
  if (typeof image !== 'number' && typeof image !== 'object') {
    throw new Error(INVALID_IMAGE_MESSAGE);
  }
  if (typeof image === 'object') {
    if (!image.uri) throw new Error(INVALID_IMAGE_MESSAGE);
    if (typeof image.uri !== 'string') throw new Error(INVALID_IMAGE_MESSAGE);
  }
}

export function validateOptions(options: Options) {
  if (typeof options !== 'object') {
    throw new Error(INVALID_OPTIONS_MESSAGE);
  } else {
    const validKeys = ['region', 'maximumColorCount', 'type'];
    Object.keys(options).forEach((opt: string) => {
      if (!validKeys.includes(opt)) {
        throw new Error(INVALID_OPTIONS_MESSAGE);
      }
    });
  }
}

export function validateRegion(region: Region) {
  if (typeof region !== 'object') {
    throw new Error(INVALID_OPTIONS_MESSAGE);
  } else {
    const validKeys = ['top', 'bottom', 'left', 'right'];
    Object.keys(region).forEach((reg: string) => {
      if (!validKeys.includes(reg) || typeof region[reg] !== 'number') {
        throw new Error(INVALID_OPTIONS_MESSAGE);
      }
    });
  }
}

export function validateMaximumColorCount(maxColorCount: number) {
  if (
    typeof maxColorCount !== 'number' ||
    maxColorCount <= 0 ||
    maxColorCount % 1 !== 0
  ) {
    throw new Error(INVALID_POSITIVE_INTEGER_MESSAGE);
  }
}

export function validateType(type: ColorProfile | Array<ColorProfile>) {
  if (typeof type !== 'string' && !Array.isArray(type)) {
    throw new Error(INVALID_TYPE_MESSAGE);
  }
  if (Array.isArray(type)) {
    type.forEach((t: string) => {
      if (typeof t !== 'string') throw new Error(INVALID_TYPE_MESSAGE);
    });
  }
}
