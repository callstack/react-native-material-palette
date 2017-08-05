/* eslint-disable import/first */
jest.mock('../index.js', () => ({ createMaterialPalette: jest.fn() }));
jest.mock('../utils/validateCreatePaletteArgs', () => ({
  __esModule: true,
  validateDefaults: jest.fn(),
}));

import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { shallow, render } from 'enzyme';
import PaletteProvider, { KEY } from '../PaletteProvider';
import { createMaterialPalette } from '../index';
import { defaultSwatches } from '../constants/defaults';

// eslint-disable-next-line react/prefer-stateless-function
class TestComponent extends React.Component {
  static contextTypes = {
    [KEY]: PropTypes.func.isRequired,
  };

  render() {
    this.props.onRender(this.context);
    return <Text>TestComponent</Text>;
  }
}

describe('PaletteProvider', () => {
  beforeEach(() => {
    createMaterialPalette.mockReset();
  });

  it('should create palette and call `onInit` and `onFinish` handlers', done => {
    createMaterialPalette.mockImplementation(() =>
      Promise.resolve({ vibrant: defaultSwatches.vibrant }));

    function onFinish(palette) {
      expect(createMaterialPalette).toHaveBeenCalledWith(
        0,
        {
          type: 'vibrant',
        },
        {
          vibrant: {
            color: '#000000',
            bodyTextColor: '#FFFFFF',
            titleTextColor: '#FFFFFF',
          },
        },
      );
      expect(palette).toEqual({
        vibrant: defaultSwatches.vibrant,
      });
      done();
    }

    render(
      <PaletteProvider
        image={0}
        options={{ type: 'vibrant' }}
        onFinish={onFinish}
        defaults={{
          vibrant: {
            color: '#000000',
            bodyTextColor: '#FFFFFF',
            titleTextColor: '#FFFFFF',
          },
        }}
      >
        <Text>Test</Text>
      </PaletteProvider>,
    );
  });

  it('should pass `subscribe` function via context', done => {
    createMaterialPalette.mockImplementation(() =>
      Promise.resolve({ vibrant: null }));

    function onRender(context) {
      expect(typeof context[KEY]).toEqual('function');
      done();
    }

    render(
      <PaletteProvider
        image={'path/to/image'}
        options={{ type: 'vibrant' }}
        forceRender
      >
        <TestComponent onRender={onRender} />
      </PaletteProvider>,
    );
  });

  it('should run `onError` handler if palette creation fails', done => {
    createMaterialPalette.mockImplementation(() =>
      Promise.reject(new Error('test')));

    function onError(error) {
      expect(error.message).toEqual('test');
      done();
    }

    render(
      <PaletteProvider
        image={0}
        options={{ type: 'vibrant' }}
        onError={onError}
      >
        <Text>Test</Text>
      </PaletteProvider>,
    );
  });

  it('should throw error if `onError` was not passed and palette creation fails', () =>
    new Promise(resolve => {
      function checkErrorAndFinish(error) {
        expect(error.message).toMatch(/MaterialPaletteProvider.*test/);
        resolve();
      }

      createMaterialPalette.mockImplementation(() => ({
        then() {
          return this;
        },
        catch(errorHandler) {
          try {
            errorHandler(new Error('test'));
          } catch (error) {
            checkErrorAndFinish(error);
          }
        },
      }));

      render(
        <PaletteProvider image={0} options={{ type: 'vibrant' }}>
          <Text>Test</Text>
        </PaletteProvider>,
      );
    }));

  it('should render children if `forceRender` is true when creating palette', done => {
    createMaterialPalette.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(
            () => {
              resolve({ vibrant: {} });
            },
            50,
          );
        }),
    );

    let firstNotification = true;
    function onRender(context) {
      setTimeout(
        () => {
          context[KEY](data => {
            if (firstNotification) {
              firstNotification = false;
              expect(data).toBeNull();
            } else {
              expect(data.palette.vibrant).toEqual({});
              done();
            }
          });
        },
        10,
      );
    }

    const wrapper = render(
      <PaletteProvider image={0} options={{ type: 'vibrant' }} forceRender>
        <TestComponent onRender={onRender} />
      </PaletteProvider>,
    );

    expect(wrapper.text()).toEqual('TestComponent');
  });

  it('should render component specified in `waitForPalette` when creating palette', () => {
    createMaterialPalette.mockImplementation(() => new Promise(() => {}));
    const wrapper = shallow(
      <PaletteProvider
        image={0}
        options={{ type: 'vibrant' }}
        LoaderComponent={() => <Text>Loading</Text>}
      >
        <Text>Test</Text>
      </PaletteProvider>,
    );
    expect(wrapper.shallow().props().children).toEqual('Loading');
  });
});
