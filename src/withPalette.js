/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KEY } from './PaletteProvider';

import type { PaletteInstance, ColorProfile, PaletteDefaults } from './types';

type State = {
  palette: ?PaletteInstance,
  globalDefaults: ?PaletteDefaults,
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
  mapPaletteToStyle: ?(palette: PaletteInstance) => {
    [key: string]: mixed,
  },
  localDefaults?: PaletteDefaults,
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
          globalDefaults: PaletteDefaults,
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

      _mergePaletteWithDefaults(): PaletteInstance {
        const { palette, globalDefaults } = this.state;

        // Create swatches with initial properties
        let swatches = [
          ...Object.keys(palette || {}),
          ...Object.keys(globalDefaults || {}),
          ...Object.keys(localDefaults || {}),
        ].reduce(
          (acc: *, key: string) => ({
            ...acc,
            [key]: { population: 0 },
          }),
          {},
        );

        // Merge global defaults
        // $FlowFixMe
        swatches = Object.keys(swatches).reduce(
          (acc: *, key: ColorProfile) => ({
            ...acc,
            [key]: {
              ...acc[key],
              ...(globalDefaults && globalDefaults[key]
                ? globalDefaults[key]
                : {}),
              ...(localDefaults && localDefaults[key]
                ? localDefaults[key]
                : {}),
            },
          }),
          swatches,
        );

        // Merge swatches from palette
        // $FlowFixMe
        return Object.keys(swatches).reduce(
          (acc: *, key: ColorProfile) => ({
            ...acc,
            [key]: {
              ...acc[key],
              ...(palette && palette[key] ? palette[key] : {}),
            },
          }),
          swatches,
        );
      }

      render() {
        const { style, ...rest } = this.props;
        const palette: PaletteInstance = this._mergePaletteWithDefaults();
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
