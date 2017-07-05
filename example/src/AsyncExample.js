import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import MaterialPalette from 'react-native-material-palette';

export default class AsyncExample extends Component {
  state = {
    isLoading: true,
    palette: null,
  };

  async componentDidMount() {
    const palette = await MaterialPalette.create(
      require('../assets/wroclaw.jpg'), // eslint-disable-line global-require
      {
        types: ['lightMuted', 'darkVibrant', 'vibrant'],
      },
    );
    this.setState({
      palette,
      isLoading: false,
    });
  }

  render() {
    const { palette, isLoading } = this.state;
    return (
      <View style={styles.container}>
        {isLoading
          ? <Text>
              Generating palette asynchronously...
            </Text>
          : <View>
              <Image
                source={require('../assets/wroclaw.jpg')}
                style={styles.image}
              />
              {Object.keys(palette).map(profile => (
                <View
                  style={{
                    backgroundColor: palette[profile].color,
                    height: 50,
                  }}
                  key={profile}
                >
                  <Text style={{ color: palette[profile].bodyTextColor }}>
                    {profile.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>}
      </View>
    );
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
