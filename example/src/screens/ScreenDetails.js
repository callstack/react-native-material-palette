// @flow

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialPaletteProvider } from 'react-native-material-palette';
import Toolbar from '../components/Toolbar';
import Fab from '../components/Fab';
import Article from '../components/Article';

export default class ScreenDetails extends React.Component {
  static navigationOptions = {
    header: null,
  };

  navigateBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <PaperProvider>
        <MaterialPaletteProvider
          image={require('../../assets/Landscape.jpg')}
          options={{
            type: ['vibrant', 'muted', 'lightVibrant', 'lightMuted'],
          }}
        >
          <View style={styles.container}>
            <Toolbar dark={false} onArrowBackPressed={this.navigateBack} />
            <Image
              source={require('../../assets/Landscape.jpg')}
              style={styles.cover}
            />
            <Fab icon="add" />
            <Article />
          </View>
        </MaterialPaletteProvider>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cover: {
    height: 250,
    width: null,
  },
});
