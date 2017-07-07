/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createEventEmitter from './eventEmitter';
import MaterialPalette from './index';

import type { PaletteInstance, Image, Options } from './types';

export const KEY = '__react-native-material-palette__';

type Props = {
  image: Image,
  options: ?Options,
  children: React$Element<*>,
  onError: ?(error: Error) => void,
  waitForPalette: ?boolean | React$Component<*, *, *>,
};

type State = {
  palette: ?PaletteInstance,
};

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
      ...this.context,
      [KEY]: this.eventEmitter.subscribe,
    };
  }

  componentWillMount() {
    MaterialPalette.create(this.props.image, this.props.options)
      .then((palette: PaletteInstance) => {
        if (this.props.waitForPalette) {
          this.setState({ palette });
        }
        this.eventEmitter.publish(palette);
      })
      .catch((error: Error) => {
        if (typeof this.props.onError === 'function') {
          this.props.onError(error);
        }
      });
  }

  render() {
    if (this.props.waitForPalette && !this.state.palette) {
      return typeof this.props.waitForPalette === 'boolean'
        ? null
        : <this.props.waitForPalette />;
    }
    return this.props.children;
  }
}
