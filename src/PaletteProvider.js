/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createEventEmitter from './createEventEmitter';
import { createMaterialPalette } from './index';
import { validateDefaults } from './utils/validateCreatePaletteArgs';

import type { PaletteInstance, Image, Options, PaletteDefaults } from './types';

export const KEY = '__react-native-material-palette__';

type Props = {
  /**
   * Image from which to generate the palette
   */
  image: Image,
  /**
   * Options for palette generation
   */
  options?: Options,
  /**
   * Global defaults for Swatches
   */
  defaults?: PaletteDefaults,
  /**
   * Children
   */
  children: React$Element<*>,
  /**
   * Error handler, called when palette generation fails
   */
  onError?: (error: Error) => void,
  /**
   * Finish handler, called right after the palette is generated
   */
  onFinish?: (palette: PaletteInstance) => void,
  /**
   * Render the children regardless whether palette is still being created, does not
   * take effect if `LoaderComponent` is specified
   */
  forceRender?: boolean,
  /**
   * Render LoaderComponent when the palette is being created
   */
  LoaderComponent?: ReactClass<*> | ((...args: Array<*>) => React.Element<*>),
};

type State = {
  palette: ?PaletteInstance,
};

/**
 * Provides broadcast for material palette instance via context.
 * Passes `subscribe` method via context, which `withPalette` can call
 * and subscribe in order to receive the palette instance.
 */
export default class MaterialPaletteProvider
  extends Component<void, Props, State> {
  static childContextTypes = {
    [KEY]: PropTypes.func.isRequired,
  };

  state: State = {
    palette: null,
  };

  eventEmitter = createEventEmitter(null);

  getChildContext() {
    return {
      [KEY]: this.eventEmitter.subscribe,
    };
  }

  componentWillMount() {
    if (this.props.defaults) {
      validateDefaults(this.props.defaults);
    }

    this._createPalette();
  }

  _createPalette = () => {
    const { image, options, defaults, onFinish, onError } = this.props;

    createMaterialPalette(image, options, defaults).then(
      palette => {
        if (onFinish) onFinish(palette);

        this.eventEmitter.publish({
          palette,
        });
        this.setState({ palette });
      },
      error => {
        if (onError) {
          onError(error);
        } else {
          error.message = `Uncaught MaterialPaletteProvider exception: ${error.message}`; // eslint-disable-line no-param-reassign
          throw error;
        }
      }
    );
  };

  render() {
    const { forceRender, LoaderComponent, children } = this.props;
    const shouldRender = this.state.palette || forceRender;

    if (LoaderComponent && !this.state.palette) {
      return <LoaderComponent />;
    }

    if (shouldRender) {
      return React.Children.only(children);
    }

    return null;
  }
}
