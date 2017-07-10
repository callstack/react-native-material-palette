/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KEY } from './PaletteProvider';

import type { PaletteInstance } from './types';

type State = {
  palette: ?PaletteInstance,
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
  mapPaletteToStyle: ?(palette: PaletteInstance) => { [key: string]: mixed },
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
        };
      }

      static contextTypes = {
        [KEY]: PropTypes.func.isRequired,
      };

      componentWillMount() {
        this.unsubscribe = this.context[KEY]((palette: PaletteInstance) => {
          this.setState({ palette });
        });
      }

      componentWillUnmount() {
        if (typeof this.unsubscribe === 'function') {
          this.unsubscribe();
        }
      }

      render() {
        const { style, ...rest } = this.props;
        const stylesFromPalette = this.state.palette &&
          typeof mapPaletteToStyle === 'function'
          ? mapPaletteToStyle(this.state.palette)
          : {};

        return (
          <WrappedComponent
            {...rest}
            style={[
              ...(Array.isArray(style) ? style : [style]),
              stylesFromPalette,
            ]}
            palette={this.state.palette}
          />
        );
      }
    };
}
