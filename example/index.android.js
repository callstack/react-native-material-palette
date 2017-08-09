/**
 * Sample Material Palette App
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import ImageGallery from './src/screens/ImageGallery';
import ScreenDetails from './src/screens/ScreenDetails';

class Menu extends Component {
  static navigationOptions = {
    title: 'Palette Example',
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ padding: 15 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigate('ImageGallery')}
        >
          <Text style={styles.text}>
            Image Gallery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigate('ScreenDetails')}
        >
          <Text style={styles.text}>
            Screen Details
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const PaletteExample = StackNavigator({
  Home: { screen: Menu },
  ImageGallery: { screen: ImageGallery },
  ScreenDetails: { screen: ScreenDetails },
});

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'blue',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    color: 'white',
  },
});

AppRegistry.registerComponent('PaletteExample', () => PaletteExample);
