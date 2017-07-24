/**
 * Created by rauliyohmc on 24/07/2017.
 */

/* eslint flowtype/require-parameter-type: 0 */
import validation, {
  INVALID_IMAGE_MESSAGE,
  INVALID_OPTIONS_MESSAGE,
  INVALID_POSITIVE_INTEGER_MESSAGE,
  INVALID_TYPE_MESSAGE,
  validateImage,
  validateOptions,
  validateRegion,
  validateMaximumColorCount,
  validateType,
} from '../validation';
import { defaultOptions } from '../../constants/defaults';

const VALID_IMAGE = { uri: 'https://something.image.jpg' };

describe('validation', () => {
  it('should run all validators if all args are passed', () => {
    expect(() => validation(VALID_IMAGE, defaultOptions)).not.toThrow();
  });

  it('Should throw if image param is not valid', () => {
    expect(() => validateImage(false)).toThrow(INVALID_IMAGE_MESSAGE);
    expect(() => validateImage({ urii: '' })).toThrow(INVALID_IMAGE_MESSAGE);
    expect(() => validateImage({ uri: 45 })).toThrow(INVALID_IMAGE_MESSAGE);
    expect(() => validateImage(4)).not.toThrow();
    expect(() => validateImage(VALID_IMAGE)).not.toThrow();
  });

  it('Should throw if options param is not valid', () => {
    expect(() => validateOptions('hello')).toThrow(INVALID_OPTIONS_MESSAGE);
    expect(() =>
      validateOptions({ foo: 'something', bar: 'something' })).toThrow(
      INVALID_OPTIONS_MESSAGE,
    );
    expect(() =>
      validateOptions({
        region: 'region',
        type: 'vibrant',
        foo: 'foo',
      })).toThrow(INVALID_OPTIONS_MESSAGE);
    expect(() => validateOptions({})).not.toThrow();
    expect(() =>
      validateOptions({
        region: 'region',
        type: 'type',
        maximumColorCount: 4,
      })).not.toThrow();
  });

  it('Should throw if region param is not valid', () => {
    expect(() => validateRegion('region')).toThrow(INVALID_OPTIONS_MESSAGE);
    expect(() =>
      validateRegion({ invalid: 1, bottom: 4, left: 4, right: 8 })).toThrow(
      INVALID_OPTIONS_MESSAGE,
    );
    expect(() =>
      validateRegion({ top: 1, bottom: 45, left: 8, right: 1 })).not.toThrow(
      INVALID_OPTIONS_MESSAGE,
    );
  });

  it('Should throw if maximumColorCount is not valid', () => {
    expect(() => validateMaximumColorCount('hola')).toThrow(
      INVALID_POSITIVE_INTEGER_MESSAGE,
    );
    expect(() => validateMaximumColorCount(-1)).toThrow(
      INVALID_POSITIVE_INTEGER_MESSAGE,
    );
    expect(() => validateMaximumColorCount(22.3)).toThrow(
      INVALID_POSITIVE_INTEGER_MESSAGE,
    );
    expect(() => validateMaximumColorCount(4)).not.toThrow();
  });

  it('should throw if type is not valid', () => {
    expect(() => validateType(12)).toThrow(INVALID_TYPE_MESSAGE);
    expect(() => validateType(['muted', 12])).toThrow(INVALID_TYPE_MESSAGE);
    expect(() => validateType('vibrant')).not.toThrow();
    expect(() => validateType(['vibrant', 'lightVibrant'])).not.toThrow();
  });
});
