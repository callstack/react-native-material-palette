// @flow

import { validColorProfiles } from '../constants/defaults';
import type {
  Image,
  Options,
  Region,
  ColorProfile,
  PaletteDefaults,
} from '../types';

export const INVALID_IMAGE_MESSAGE = 'Invalid image param, you should either require a local asset, or provide an external URI';

export const createOptionsErrorMessage = (hint: string): string =>
  `Invalid options param - ${hint}. Please refer to the API documentation`;

export default function validate(image: Image, options: Options) {
  validateImage(image);
  validateOptionsKeys(options);
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

export function validateOptionsKeys(options: Options) {
  if (typeof options !== 'object') {
    throw new Error(createOptionsErrorMessage('options should be an object'));
  } else {
    const validKeys = ['region', 'maximumColorCount', 'type'];
    Object.keys(options).forEach((opt: string) => {
      if (!validKeys.includes(opt)) {
        throw new Error(createOptionsErrorMessage(`${opt} is not a valid key`));
      }
    });
  }
}

export function validateRegion(region: Region) {
  if (typeof region !== 'object') {
    throw new Error(
      createOptionsErrorMessage('options.region should be an object'),
    );
  } else {
    const validKeys = ['top', 'bottom', 'left', 'right'];
    Object.keys(region).forEach((reg: string) => {
      const isNumber = typeof region[reg] === 'number';
      if (!validKeys.includes(reg) || !isNumber) {
        throw new Error(
          createOptionsErrorMessage(
            `region.${reg} ${!isNumber ? 'should be a number' : 'is not a valid param'}`,
          ),
        );
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
    throw new Error(
      createOptionsErrorMessage(
        'options.maximumColorCount should be positive integer',
      ),
    );
  }
}

export function validateType(type: ColorProfile | Array<ColorProfile>) {
  if (typeof type !== 'string' && !Array.isArray(type)) {
    throw new Error(
      createOptionsErrorMessage(
        'options.type should be either a string or an Array of strings',
      ),
    );
  }
  if (Array.isArray(type)) {
    type.forEach((t: string) => {
      if (typeof t !== 'string') {
        throw new Error(
          createOptionsErrorMessage(
            'options.type should be an Array of strings',
          ),
        );
      }
    });
  }
}

export function validateDefaults(defaults: PaletteDefaults) {
  if (typeof defaults !== 'object') {
    throw new Error('this.props.defaults should be an object');
  } else {
    const validProfilesKeys = ['bodyTextColor', 'color', 'titleTextColor'];
    (Object.keys((defaults: any)): ColorProfile[]).forEach(profile => {
      if (!Object.keys(validColorProfiles).includes(profile)) {
        throw new Error(
          `${profile} is not a valid color profile for this.props.defaults. Please refer to the API documentation`,
        );
      } else {
        const profileKeys = Object.keys(defaults[profile]).sort();
        const areTypesCorrect = profileKeys.every(
          key => typeof defaults[profile][key] === 'string',
        );
        const areEqual = validProfilesKeys.length === profileKeys.length &&
          validProfilesKeys.every((v, i) => v === profileKeys[i]);
        if (!areEqual) {
          throw new Error(
            `Each default profile should define 'bodyTextColor', 'color' and 'titleTextColor' parameters. Please refer to the API documentation`,
          );
        }
        if (!areTypesCorrect) {
          throw new Error(
            `'bodyTextColor', 'color' and 'titleTextColor' should all be strings`,
          );
        }
      }
    });
  }
}
