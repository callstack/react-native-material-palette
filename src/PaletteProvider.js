/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createEventEmitter from './createEventEmitter';
import { createMaterialPalette } from './index';
import { defaultSwatches } from './constants/defaults';
import { validateDefaults } from './utils/validate';

import type {
  PaletteInstance,
  Image,
  Options,
  PaletteDefaults,
  ColorProfile,
} from './types';

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
   * Initialization handler, called right before generation the palette
   */
  onInit?: () => void,
  /**
   * Finish handler, called right after the palette is generated
   */
  onFinish?: (
    palette: PaletteInstance,
    globalDefaults: PaletteDefaults,
  ) => void,
  /**
   * Render the children regardless whether palette is still being created, does not
   * take effect if `LoaderComponent` is specified
   */
  forceRender?: boolean,
  /**
   * Render LoaderComponent when the palette is being created
   */
  LoaderComponent?:
    | React$Component<*, *, *>
    | ((...args: *) => React$Element<*>),
};

type State = {
  palette: ?PaletteInstance,
};

function execIfFunction(possibleFunction: mixed, ...args: *): boolean {
  if (typeof possibleFunction === 'function') {
    possibleFunction(...args);
    return true;
  }
  return false;
}

/**
 * Provides broadcast for material palette instance via context.
 * Passes `subscribe` method via context, which `withPalette` can call
 * and subscribe in order to receive the palette instance.
 */
export default class MaterialPaletteProvider
  extends Component<void, Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      palette: null,
    };
  }
  static childContextTypes = {
    [KEY]: PropTypes.func.isRequired,
  };

  eventEmitter = createEventEmitter(null);

  getChildContext() {
    return {
      [KEY]: this.eventEmitter.subscribe,
    };
  }

  _mergeWithDefaults(palette: PaletteInstance) {
    const defaults = {
      ...defaultSwatches,
      ...((Object.keys(
        this.props.defaults || {},
      ): any): ColorProfile[]).reduce(
        (acc: *, profile: ColorProfile) => ({
          ...acc,
          [profile]: {
            ...((this.props.defaults
              ? this.props.defaults[profile]
              : defaultSwatches[profile]) || defaultSwatches[profile]),
            population: 0,
          },
        }),
        {},
      ),
    };
    return {
      ...((Object.keys(palette): any): ColorProfile[])
        .filter((profile: ColorProfile) => !!palette[profile]) // Stripping out unavailable profiles
        .reduce(
          (acc: *, profile: ColorProfile) => ({
            ...acc,
            [profile]: palette[profile],
          }),
          {},
        ),
      ...defaults,
    };
  }

  componentWillMount() {
    if (this.props.defaults) {
      validateDefaults(this.props.defaults);
    }
    execIfFunction(this.props.onInit);
    createMaterialPalette(this.props.image, this.props.options)
      .then((palette: PaletteInstance) => {
        const paletteWithDefaults = this._mergeWithDefaults(palette);
        execIfFunction(this.props.onFinish, paletteWithDefaults);
        if (!this.props.forceRender) {
          this.setState({ palette: paletteWithDefaults });
        }
        this.eventEmitter.publish({
          palette: paletteWithDefaults,
        });
      })
      .catch((error: Error) => {
        const isCalled = execIfFunction(this.props.onError, error);
        if (!isCalled) {
          const enhancedError = error;
          enhancedError.message = `Uncaught MaterialPaletteProvider exception: ${enhancedError.message}`;
          throw enhancedError;
        }
      });
  }

  render() {
    if (!this.state.palette && this.props.LoaderComponent) {
      return <this.props.LoaderComponent />;
    } else if (!this.state.palette && !this.props.forceRender) {
      return null;
    }

    return React.Children.only(this.props.children);
  }
}
