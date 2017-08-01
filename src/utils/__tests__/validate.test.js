/* eslint flowtype/require-parameter-type: 0 */
import validate, {
  INVALID_IMAGE_MESSAGE,
  createOptionsErrorMessage,
  validateImage,
  validateOptionsKeys,
  validateRegion,
  validateMaximumColorCount,
  validateType,
  validateDefaults,
} from '../validate';
import { defaultOptions, defaultProfile } from '../../constants/defaults';

const VALID_IMAGE = { uri: 'https://something.image.jpg' };

describe('validation', () => {
  it('should run all validators if all args are passed', () => {
    expect(() => validate(VALID_IMAGE, defaultOptions)).not.toThrow();
  });

  it('Should throw if image param is not valid', () => {
    expect(() => validateImage(false)).toThrow(INVALID_IMAGE_MESSAGE);
    expect(() => validateImage({ urii: '' })).toThrow(INVALID_IMAGE_MESSAGE);
    expect(() => validateImage({ uri: 45 })).toThrow(INVALID_IMAGE_MESSAGE);
    expect(() => validateImage(4)).not.toThrow();
    expect(() => validateImage(VALID_IMAGE)).not.toThrow();
  });

  it('Should throw if options param is not valid', () => {
    expect(() => validateOptionsKeys('hello')).toThrow(
      createOptionsErrorMessage('options should be an object'),
    );
    expect(() => validateOptionsKeys({ foo: 'something' })).toThrow(
      createOptionsErrorMessage(`foo is not a valid key`),
    );
    expect(() =>
      validateOptionsKeys({
        region: 'region',
        type: 'vibrant',
        bar: 'bar',
      })).toThrow(createOptionsErrorMessage(`bar is not a valid key`));
    expect(() => validateOptionsKeys({})).not.toThrow();
    expect(() =>
      validateOptionsKeys({
        region: 'region',
        type: 'type',
        maximumColorCount: 4,
      })).not.toThrow();
  });

  it('Should throw if region param is not valid', () => {
    expect(() => validateRegion('region')).toThrow(
      createOptionsErrorMessage('options.region should be an object'),
    );
    expect(() =>
      validateRegion({ foo: 1, bottom: 4, left: 4, right: 8 })).toThrow(
      createOptionsErrorMessage('region.foo is not a valid param'),
    );
    expect(() =>
      validateRegion({ top: 1, bottom: '4', left: 4, right: 8 })).toThrow(
      createOptionsErrorMessage('region.bottom should be a number'),
    );
    expect(() =>
      validateRegion({ top: 1, bottom: 45, left: 8, right: 1 })).not.toThrow();
  });

  it('Should throw if maximumColorCount is not valid', () => {
    expect(() => validateMaximumColorCount('hola')).toThrow(
      createOptionsErrorMessage(
        'options.maximumColorCount should be positive integer',
      ),
    );
    expect(() => validateMaximumColorCount(-1)).toThrow(
      createOptionsErrorMessage(
        'options.maximumColorCount should be positive integer',
      ),
    );
    expect(() => validateMaximumColorCount(22.3)).toThrow(
      createOptionsErrorMessage(
        'options.maximumColorCount should be positive integer',
      ),
    );
    expect(() => validateMaximumColorCount(4)).not.toThrow();
  });

  it('should throw if type is not valid', () => {
    expect(() => validateType(12)).toThrow(
      createOptionsErrorMessage(
        'options.type should be either a string or an Array of strings',
      ),
    );
    expect(() => validateType(['muted', 12])).toThrow(
      createOptionsErrorMessage('options.type should be an Array of strings'),
    );
    expect(() => validateType('vibrant')).not.toThrow();
    expect(() => validateType(['vibrant', 'lightVibrant'])).not.toThrow();
  });

  it('this.props.defaults validation', () => {
    const invalidDefaults1 = 'hej';
    const invalidDefaults2 = {
      foo: 'bar',
      vibrant: 'bar',
    };
    const invalidDefaults3 = {
      lightVibrant: 'foo',
      muted: {
        color: '#000000',
        bodyTextColor: '#000000',
        titleTextColor: '#000000',
      },
    };
    const invalidDefaults4 = {
      muted: {
        color: '#000000',
        bodyTextColor: '#000000',
        titleTextColor: '#000000',
      },
      darkVibrant: {
        color: '#000000',
        bodyTextColor: 12,
        titleTextColor: '#000000',
      },
    };
    const validDefaults = {
      muted: defaultProfile,
      darkMuted: defaultProfile,
      lightMuted: defaultProfile,
      darkVibrant: defaultProfile,
      vibrant: defaultProfile,
      lightVibrant: defaultProfile,
    };

    expect(() => validateDefaults(invalidDefaults1)).toThrow(
      'this.props.defaults should be an object',
    );
    expect(() => validateDefaults(invalidDefaults2)).toThrow(
      'foo is not a valid color profile for this.props.defaults. Please refer to the API documentation',
    );
    expect(() => validateDefaults(invalidDefaults3)).toThrow(
      `Each default profile should define 'bodyTextColor', 'color' and 'titleTextColor' parameters. Please refer to the API documentation`,
    );
    expect(() => validateDefaults(invalidDefaults4)).toThrow(
      `'bodyTextColor', 'color' and 'titleTextColor' should all be strings`,
    );
    expect(() => validateDefaults(validDefaults)).not.toThrow();
  });
});
