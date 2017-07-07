/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KEY } from './PaletteProvider';

import type { PaletteInstance } from './types';

type State = {
  palette: ?PaletteInstance,
};

export default function withMaterialPalette(/* opts */) {
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
        return (
          <WrappedComponent {...this.props} palette={this.state.palette} />
        );
      }
    };
}
