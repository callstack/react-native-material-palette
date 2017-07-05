/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { AppRegistry, View, Button, StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import AsyncExample from './src/AsyncExample';
import ComponentsExample from './src/ComponentsExample';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'RN Material Palette',
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <View style={styles.button}>
          <Button onPress={() => navigate('Async')} title="Async API" />
        </View>
        <View style={styles.button}>
          <Button
            onPress={() => navigate('Components')}
            title="UI Components"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
});

const ExampleApp = StackNavigator({
  Home: { screen: HomeScreen },
  Async: { screen: AsyncExample },
  Components: { screen: ComponentsExample },
});

AppRegistry.registerComponent('TestPalette', () => ExampleApp);
