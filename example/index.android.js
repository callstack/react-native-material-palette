/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { AppRegistry, StyleSheet, View } from 'react-native';
import MaterialPalette from 'react-native-material-palette';

function TestPalette() {
  return (
    <View style={styles.container}>
      <MaterialPalette.Background
        source={require('./assets/wroclaw.jpg')}
        style={{ height: 150, width: 200 }}
      />
      <View style={{ height: 150, width: 200, backgroundColor: 'green' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  image: {
    height: 200,
    width: null,
    resizeMode: 'cover',
  },
});

AppRegistry.registerComponent('TestPalette', () => TestPalette);
