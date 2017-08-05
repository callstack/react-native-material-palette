/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image, FlatList } from 'react-native';

import { createMaterialPalette } from 'react-native-material-palette';

export default class TestPalette extends Component {
  state = {
    isLoading: true,
    palette: null,
  };

  async componentDidMount() {
    const palette = await createMaterialPalette(
      require('./assets/wroclaw.jpg'), // eslint-disable-line global-require
      {
        type: ['lightMuted', 'darkVibrant', 'vibrant'],
      },
    );
    this.setState({
      palette,
      isLoading: false,
    });
  }

  render() {
    const { palette, isLoading } = this.state;

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    height: 200,
    width: null,
    resizeMode: 'cover',
  },
});

AppRegistry.registerComponent('TestPalette', () => TestPalette);
