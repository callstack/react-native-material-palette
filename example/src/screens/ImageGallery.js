import React, { Component } from 'react';
import { FlatList, Image, View, Text } from 'react-native';
import { createMaterialPalette } from 'react-native-material-palette';

export default class ImageGallery extends Component {
  static navigationOptions = {
    title: 'Image Gallery',
  };

  state = {
    data: [],
    error: false,
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
    try {
      const randomImageUrls = (await Promise.all(
        searchTerms.map(term =>
          fetch(`https://source.unsplash.com/featured/?${term}`)),
      )).map((response, index) => ({
        url: response.url,
        key: searchTerms[index],
      }));

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
    } catch (error) {
      // eslint-disable-next-line
      this.setState({
        error: true,
      });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
            backgroundColor: 'red',
          }}
        >
          <Text style={{ color: 'white' }}>
            Unsplash API is down, please try later or tweak the example to use a different image src
          </Text>
        </View>
      );
    }
    if (!this.state.data.length) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
          <Text>
            Loading...
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        data={this.state.data}
        numColumns={2}
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
