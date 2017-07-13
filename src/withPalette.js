/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KEY } from './PaletteProvider';

import type {
  PaletteInstance,
  ColorProfile,
  DefaultPaletteInstance,
  PaletteInstanceWithDefaults,
} from './types';

type State = {
  palette: ?PaletteInstance,
  globalDefaults: ?DefaultPaletteInstance,
};

/**
 * Connect component to a material palette notification channel in order to obtain
 * pallete instance when palette is resolved.
 * Prop `palette` will be passed to wrapped component with either `null` or with palette instance.
 * 
 * If `mapPaletteToStyle` is specified, it will be evaluated when pallete is available and
 * the results will be passed to a `style` prop to wrapped component.
 */
export default function withMaterialPalette(
  mapPaletteToStyle: ?(palette: PaletteInstanceWithDefaults) => {
    [key: string]: mixed,
  },
) {
  return (WrappedComponent: ReactClass<*>) =>
    class MaterialPaletteConnector extends Component<void, *, State> {
      unsubscribe: ?() => void;
      state: State;

      constructor(props: *) {
        super(props);
        this.unsubscribe = null;
        this.state = {
          palette: null,
          globalDefaults: null,
        };
      }

      static contextTypes = {
        [KEY]: PropTypes.func.isRequired,
      };

      componentWillMount() {
        this.unsubscribe = this.context[KEY]((data: {
          palette: PaletteInstance,
          globalDefaults: DefaultPaletteInstance,
        }) => {
          if (data) {
            this.setState(data);
          }
        });
      }

      componentWillUnmount() {
        if (typeof this.unsubscribe === 'function') {
          this.unsubscribe();
        }
      }

      _mergePaletteWithDefaults(): PaletteInstanceWithDefaults {
        const { palette, globalDefaults } = this.state;
        // $FlowFixMe
        return Object.keys(palette || {}).reduce(
          (
            acc: PaletteInstanceWithDefaults,
            key: ColorProfile,
          ): PaletteInstanceWithDefaults =>
            acc[key]
              ? // $FlowFixMe if `palette` is null, this will not be invoked
                { ...acc, [key]: { ...acc[key], ...(palette[key] || {}) } }
              : // $FlowFixMe if `palette` is null, this will not be invoked
                { ...acc, [key]: palette[key] },
          globalDefaults,
        );
      }

      render() {
        const { style, ...rest } = this.props;
        const palette = this._mergePaletteWithDefaults();
        const stylesFromPalette = this.state.palette &&
          typeof mapPaletteToStyle === 'function'
          ? mapPaletteToStyle(palette)
          : {};

        return (
          <WrappedComponent
            {...rest}
            style={[
              ...(Array.isArray(style) ? style : [style]),
              stylesFromPalette,
            ]}
            palette={palette}
          />
        );
      }
    };
}
