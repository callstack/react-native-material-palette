/**
 * Sample Material Palette App
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  FlatList,
  Image,
  View,
  Text,
} from 'react-native';
import { createMaterialPalette } from 'react-native-material-palette';

type State = {
  data: Array<Object>,
};

export default class PaletteExample extends Component<void, void, State> {
  state = {
    data: [],
  };

  async componentDidMount() {
    const searchTerms = [
      'nature',
      'water',
      'landscape',
      'music',
      'flower',
      'house',
    ];
    const randomImageUrls = (await Promise.all(
      searchTerms.map(term =>
        fetch(`https://source.unsplash.com/featured/?${term}`)),
    )).map((blob, index) => ({ url: blob.url, key: searchTerms[index] }));

    const palettes = await Promise.all(
      randomImageUrls.map(({ url }) =>
        createMaterialPalette({ uri: url }, { type: 'muted' })),
    );

    // eslint-disable-next-line
    this.setState({
      data: randomImageUrls.map((imageData, index) => ({
        ...imageData,
        palette: palettes[index],
      })),
    });
  }

  render() {
    if (!this.state.data.length) return null;
    return (
      <FlatList
        contentContainerStyle={styles.list}
        data={this.state.data}
        renderItem={({ item }) => (
          <View style={{ flex: 1, margin: 5 }}>
            <Image
              source={{ uri: item.url }}
              style={{
                flex: 1,
                minWidth: 170,
                maxWidth: 223,
                height: 150,
              }}
            />
            <View
              style={{
                backgroundColor: item.palette.muted.color,
                height: 50,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: item.palette.muted.bodyTextColor }}>
                {item.key.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

AppRegistry.registerComponent('PaletteExample', () => PaletteExample);
