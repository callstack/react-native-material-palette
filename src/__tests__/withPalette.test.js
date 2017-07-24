/* eslint flowtype/require-parameter-type: 0 */
import React from 'react';
import { shallow } from 'enzyme';
import withPalette from '../withPalette';
import { KEY } from '../PaletteProvider';

function getTestComponent() {
  let firstRender = true;
  return class Test extends React.Component {
    render() {
      if (firstRender) {
        this.props.onFirstRender(this.props.palette, this.props.style);
        firstRender = false;
      } else {
        this.props.onSecondRender(this.props.palette, this.props.style);
      }

      return null;
    }
  };
}

function createContext(subscribeFn) {
  return {
    [KEY]: subscribeFn,
  };
}

const paletteMock = {
  vibrant: {
    population: 1,
    color: '#ffffff',
    bodyTextColor: '#000000',
    titleTextColor: '#000000',
  },
};

describe('withPalette', () => {
  it('should unsubscribe on unmount', () => {
    const unsubscribe = jest.fn();
    const PaletteTest = withPalette()(getTestComponent());
    const wrapper = shallow(
      <PaletteTest onFirstRender={() => {}} onSecondRender={() => {}} />,
      {
        context: createContext(() => unsubscribe),
      },
    );

    wrapper.shallow();
    wrapper.unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should try to unsubscribe on unmount', () => {
    const unsubscribe = null;
    const PaletteTest = withPalette()(getTestComponent());
    const wrapper = shallow(
      <PaletteTest onFirstRender={() => {}} onSecondRender={() => {}} />,
      {
        context: createContext(() => unsubscribe),
      },
    );
    expect(() => {
      wrapper.shallow();
      wrapper.unmount();
    }).not.toThrowError();
  });

  it('should pass a palette prop', () => {
    let subscriber = jest.fn();
    function onFirstRender(palette, style) {
      expect(palette).toEqual({});
      expect(style).toEqual([undefined, {}]);
    }
    function onSecondRender(palette, style) {
      expect(palette).toEqual(paletteMock);
      expect(style).toEqual([undefined, {}]);
    }

    const PaletteTest = withPalette()(getTestComponent());
    const wrapper = shallow(
      <PaletteTest
        onFirstRender={onFirstRender}
        onSecondRender={onSecondRender}
      />,
      {
        context: createContext(fn => {
          subscriber = fn;
        }),
      },
    );

    wrapper.shallow();
    subscriber({ palette: paletteMock, globalDefaults: null });
    wrapper.update();
  });

  it('should not update state if data is empty', () => {
    let subscriber = jest.fn();

    const PaletteTest = withPalette()(getTestComponent());
    const wrapper = shallow(
      <PaletteTest onFirstRender={() => {}} onSecondRender={() => {}} />,
      {
        context: createContext(fn => {
          subscriber = fn;
        }),
      },
    );

    wrapper.shallow();
    expect(wrapper.state()).toEqual({ palette: null, globalDefaults: null });
    subscriber(null);
    wrapper.update();
    expect(wrapper.state()).toEqual({ palette: null, globalDefaults: null });
  });

  it('should create styles from palette using `mapPaletteToStyle`', () => {
    let subscriber = jest.fn();
    function onFirstRender(palette, style) {
      expect(palette).toEqual({});
      expect(style).toEqual([{ fontSize: '14px' }, {}]);
    }
    function onSecondRender(palette, style) {
      expect(palette).toEqual(paletteMock);
      expect(style).toEqual([{ fontSize: '14px' }, { color: '#ffffff' }]);
    }

    const PaletteTest = withPalette(palette => ({
      color: palette.vibrant && palette.vibrant.color,
    }))(getTestComponent());
    const wrapper = shallow(
      <PaletteTest
        onFirstRender={onFirstRender}
        onSecondRender={onSecondRender}
        style={{ fontSize: '14px' }}
      />,
      {
        context: createContext(fn => {
          subscriber = fn;
        }),
      },
    );

    wrapper.shallow();
    subscriber({ palette: paletteMock, globalDefaults: null });
    wrapper.shallow();
  });

  it('should merge palette with global defaults', () => {
    const defaults = {
      lightVibrant: {
        color: '#f1f1f1',
        bodyTextColor: '#000000',
        titleTextColor: '#000000',
      },
    };
    let subscriber = jest.fn();
    function onFirstRender(palette, style) {
      expect(palette).toEqual({});
      expect(style).toEqual([undefined, {}]);
    }
    function onSecondRender(palette, style) {
      expect(palette).toEqual({
        ...paletteMock,
        lightVibrant: { population: 0, ...defaults.lightVibrant },
      });
      expect(style).toEqual([
        undefined,
        { color: defaults.lightVibrant.color },
      ]);
    }

    const PaletteTest = withPalette(palette => ({
      color: palette.lightVibrant && palette.lightVibrant.color,
    }))(getTestComponent());
    const wrapper = shallow(
      <PaletteTest
        onFirstRender={onFirstRender}
        onSecondRender={onSecondRender}
      />,
      {
        context: createContext(fn => {
          subscriber = fn;
        }),
      },
    );

    wrapper.shallow();
    subscriber({
      palette: paletteMock,
      globalDefaults: defaults,
    });
    wrapper.shallow();
  });

  it('should merge palette with both global and local defaults and style prop', () => {
    const globalDefaults = {
      lightVibrant: {
        color: '#f1f1f1',
        bodyTextColor: '#000000',
        titleTextColor: '#000000',
      },
      muted: {
        color: '#f1f1f1',
        bodyTextColor: '#000000',
        titleTextColor: '#000000',
      },
    };
    const localDefaults = {
      lightVibrant: {
        color: '#a4a4a4',
        bodyTextColor: '#000000',
        titleTextColor: '#000000',
      },
    };
    let subscriber = jest.fn();
    function onFirstRender(palette, style) {
      expect(palette).toEqual({
        lightVibrant: { ...localDefaults.lightVibrant, population: 0 },
      });
      expect(style).toEqual([{ fontSize: '14px' }, {}]);
    }
    function onSecondRender(palette, style) {
      expect(palette).toEqual({
        ...paletteMock,
        lightVibrant: { population: 0, ...localDefaults.lightVibrant },
        muted: { population: 0, ...globalDefaults.muted },
      });
      expect(style).toEqual([
        { fontSize: '14px' },
        {
          color: localDefaults.lightVibrant.color,
          backgroundColor: globalDefaults.muted.color,
        },
      ]);
    }

    const PaletteTest = withPalette(
      palette => ({
        color: palette.lightVibrant && palette.lightVibrant.color,
        backgroundColor: palette.muted && palette.muted.color,
      }),
      localDefaults,
    )(getTestComponent());
    const wrapper = shallow(
      <PaletteTest
        onFirstRender={onFirstRender}
        onSecondRender={onSecondRender}
        style={[{ fontSize: '14px' }]}
      />,
      {
        context: createContext(fn => {
          subscriber = fn;
        }),
      },
    );

    wrapper.shallow();
    subscriber({
      palette: paletteMock,
      globalDefaults,
    });
    wrapper.shallow();
  });

  it('should throw error if the Provider subscribe function was not found in context', () => {
    const PaletteTest = withPalette()(getTestComponent());
    expect(() => {
      shallow(
        <PaletteTest onFirstRender={() => {}} onSecondRender={() => {}} />,
      );
    }).toThrowError();
  });
});
