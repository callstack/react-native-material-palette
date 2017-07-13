/* @flow */
/* eslint-disable import/first */
jest.mock('../index.js', () => ({ create: jest.fn() }));

import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { shallow, render } from 'enzyme';
import PaletteProvider, { KEY } from '../PaletteProvider';
import MaterialPalette from '../index';

class TestComponent extends React.Component {
  static contextTypes = {
    [KEY]: PropTypes.func.isRequired,
  };

  render() {
    this.props.onRender(this.context);
    return null;
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
      expect(MaterialPalette.create).toHaveBeenCalledWith('path/to/image', {
        type: 'vibrant',
      });
      expect(palette).toEqual({ vibrant: null });
      expect(defaults).toEqual({ vibrant: { color: '#000000' } });
      done();
    }

    shallow(
      <PaletteProvider
        image={'path/to/image'}
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
      <PaletteProvider image={'path/to/image'} options={{ type: 'vibrant' }}>
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
      <PaletteProvider
        image={'path/to/image'}
        options={{ type: 'vibrant' }}
        onError={onError}
      >
        <Text>Test</Text>
      </PaletteProvider>,
    );
  });

  it('should render `null` if `waitForPalette` is true when creating palette', (done: () => void) => {
    MaterialPalette.create.mockImplementation(
      () =>
        new Promise((resolve: (v: *) => void) => {
          setTimeout(
            () => {
              resolve({ vibrant: null });
            },
            50,
          );
        }),
    );

    let wrapper;
    function onFinish() {
      setTimeout(
        () => {
          expect(wrapper.state().palette.vibrant).toBeNull();
          done();
        },
        0,
      );
    }

    wrapper = shallow(
      <PaletteProvider
        image={'path/to/image'}
        options={{ type: 'vibrant' }}
        waitForPalette
        onFinish={onFinish}
      >
        <Text>Test</Text>
      </PaletteProvider>,
    );

    expect(wrapper.text()).toEqual('');
  });

  it('should render component specified in `waitForPalette` when creating palette', () => {
    MaterialPalette.create.mockImplementation(() => new Promise(() => {}));
    const wrapper = shallow(
      <PaletteProvider
        image={'path/to/image'}
        options={{ type: 'vibrant' }}
        waitForPalette={() => <Text>Loading</Text>}
      >
        <Text>Test</Text>
      </PaletteProvider>,
    );
    expect(wrapper.shallow().props().children).toEqual('Loading');
  });
});
