/* @flow */
/* eslint-disable import/first */
jest.mock('../index.js', () => ({ create: jest.fn() }));

import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { shallow, render } from 'enzyme';
import PaletteProvider, { KEY } from '../PaletteProvider';
import MaterialPalette from '../index';

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
    MaterialPalette.create.mockReset();
  });

  it('should create pallete and call `onInit` and `onFinish` handlers', (done: () => void) => {
    MaterialPalette.create.mockImplementation(() =>
      Promise.resolve({ vibrant: null }));

    function onFinish(palette: *, defaults: *) {
      expect(MaterialPalette.create).toHaveBeenCalledWith(0, {
        type: 'vibrant',
      });
      expect(palette).toEqual({ vibrant: null });
      expect(defaults).toEqual({ vibrant: { color: '#000000' } });
      done();
    }

    shallow(
      // $FlowFixMe `children` are passed via JSX nesting
      <PaletteProvider
        image={0}
        options={{ type: 'vibrant' }}
        onFinish={onFinish}
        defaults={{ vibrant: { color: '#000000' } }}
      >
        <Text>Test</Text>
      </PaletteProvider>,
    );
  });

  it('should pass `subscribe` function via context', (done: () => void) => {
    MaterialPalette.create.mockImplementation(() =>
      Promise.resolve({ vibrant: null }));

    function onRender(context: *) {
      expect(typeof context[KEY]).toEqual('function');
      done();
    }

    render(
      // $FlowFixMe `children` are passed via JSX nesting
      <PaletteProvider
        image={'path/to/image'}
        options={{ type: 'vibrant' }}
        forceRender
      >
        <TestComponent onRender={onRender} />
      </PaletteProvider>,
    );
  });

  it('should run `onError` hanlder if pallete creation fails', (done: () => void) => {
    MaterialPalette.create.mockImplementation(() =>
      Promise.reject(new Error('test')));

    function onError(error: *) {
      expect(error.message).toEqual('test');
      done();
    }

    render(
      // $FlowFixMe `children` are passed via JSX nesting
      <PaletteProvider
        image={0}
        options={{ type: 'vibrant' }}
        onError={onError}
      >
        <Text>Test</Text>
      </PaletteProvider>,
    );
  });

  it('should throw error if `onError` was not passed and pallete creation fails', () =>
    new Promise((resolve: () => void) => {
      function checkErrorAndFinish(error: Error) {
        expect(error.message).toMatch(/MaterialPaletteProvider.*test/);
        resolve();
      }

      MaterialPalette.create.mockImplementation(() => ({
        then() {
          return this;
        },
        catch(errorHandler: *) {
          try {
            errorHandler(new Error('test'));
          } catch (error) {
            checkErrorAndFinish(error);
          }
        },
      }));

      render(
        // $FlowFixMe `children` are passed via JSX nesting
        <PaletteProvider image={0} options={{ type: 'vibrant' }}>
          <Text>Test</Text>
        </PaletteProvider>,
      );
    }));

  it('should render children if `forceRender` is true when creating palette', (done: () => void) => {
    MaterialPalette.create.mockImplementation(
      () =>
        new Promise((resolve: (v: *) => void) => {
          setTimeout(
            () => {
              resolve({ vibrant: {} });
            },
            50,
          );
        }),
    );

    let firstNatification = true;
    function onRender(context: *) {
      setTimeout(
        () => {
          context[KEY]((data: *) => {
            if (firstNatification) {
              firstNatification = false;
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
      // $FlowFixMe `children` are passed via JSX nesting
      <PaletteProvider image={0} options={{ type: 'vibrant' }} forceRender>
        <TestComponent onRender={onRender} />
      </PaletteProvider>,
    );

    expect(wrapper.text()).toEqual('TestComponent');
  });

  it('should render component specified in `waitForPalette` when creating palette', () => {
    MaterialPalette.create.mockImplementation(() => new Promise(() => {}));
    const wrapper = shallow(
      // $FlowFixMe `children` are passed via JSX nesting
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
