import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialPalette from 'react-native-material-palette';

export default class ComponentsExample extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MaterialPalette.Background
          style={{ height: 150, width: 200 }}
          testColor={9975652}
        />
        <View style={{ height: 150, width: 200, backgroundColor: 'green' }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
