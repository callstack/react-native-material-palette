/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { KEY } from './PaletteProvider';

import type { PaletteInstance, ColorProfile, PaletteDefaults } from './types';

type State = {
  palette: ?PaletteInstance,
  globalDefaults: ?PaletteDefaults,
};

/**
 * Connect component to a material palette notification channel in order to obtain
 * palette instance when palette is resolved.
 * Prop `palette` will be passed to wrapped component with either `null` or with palette instance.
 * 
 * If `mapPaletteToStyle` is specified, it will be evaluated when palette is available and
 * the results will be passed to a `style` prop to wrapped component.
 */
export default function withMaterialPalette(
  mapPaletteToStyle?: (palette: PaletteInstance) => {
    [key: string]: mixed,
  },
  localDefaults?: PaletteDefaults
) {
  return (WrappedComponent: ReactClass<*>) => {
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
        const subscribe = this.context[KEY];

        if (typeof subscribe !== 'function') {
          throw new Error(
            'Cannot find MaterialPaletteProvider key in context. ' +
              'Did you forget to add <MaterialPaletteProvider> on top of components tree?'
          );
        }

        this.unsubscribe = subscribe((data: {
          palette: PaletteInstance,
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
        const { palette } = this.state;

        return [
          ...Object.keys(palette || {}),
          ...Object.keys(localDefaults || {}),
        ].reduce(
          (acc: *, key: string) => {
            const profile = ((key: any): ColorProfile);
            return {
              ...acc,
              [key]: {
                population: 0,
                ...acc[key],
                ...(localDefaults && localDefaults[profile]
                  ? localDefaults[profile]
                  : {}),
                ...(palette && palette[profile] ? palette[profile] : {}),
              },
            };
          },
          {}
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
            style={[style, stylesFromPalette]}
            palette={palette}
          />
        );
      }
    }

    return hoistNonReactStatic(MaterialPaletteConnector, WrappedComponent);
  };
}
