/* @flow */

import React, { Component } from 'react';
import {
  FlatList,
  Image,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { createMaterialPalette } from 'react-native-material-palette';

export default class ImageGallery extends Component {
  static navigationOptions = {
    title: 'Image Gallery',
  };

  state = {
    data: [],
    error: null,
  };

  componentDidMount() {
    this._loadPalettes();
  }

  _loadPalettes = async () => {
    const words = [
      'Daleks',
      'Thals',
      'Voord',
      'Sensorites',
      'Koquillion',
      'Menoptera',
      'Zarbi',
      'Larvae guns',
      'Xerons',
      'Aridians',
      'Mire Beasts',
      'Drahvins',
    ];
    const urls = Array.from({ length: 12 }).map(
      (_, i) => `https://unsplash.it/300?random&num=${i * 100}`,
    );

    let palettes;

    try {
      palettes = await Promise.all(
        urls.map(url => createMaterialPalette({ uri: url }, { type: 'muted' })),
      );
    } catch (error) {
      this.setState({
        error,
      });
      return;
    }

    this.setState({
      data: palettes.map((palette, i) => ({
        palette,
        url: urls[i],
        label: words[i],
        key: urls[i],
      })),
    });
  };

  render() {
    if (this.state.error) {
      return (
        <View style={[styles.blankslate, styles.error]}>
          <Text style={{ color: 'white' }}>
            An error occurred: {this.state.error.message}
          </Text>
        </View>
      );
    }
    if (!this.state.data.length) {
      return (
        <View style={styles.blankslate}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <FlatList
        data={this.state.data}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Image source={{ uri: item.url }} style={styles.image} />
            <View
              style={[
                styles.label,
                {
                  backgroundColor: item.palette.muted.color,
                },
              ]}
            >
              <Text style={{ color: item.palette.muted.bodyTextColor }}>
                {item.label}
              </Text>
            </View>
          </View>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    minWidth: 120,
    maxWidth: 180,
    height: 120,
  },
  blankslate: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  error: {
    backgroundColor: 'red',
  },
  label: {
    padding: 8,
  },
});
