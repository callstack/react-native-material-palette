/* @flow */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialPaletteProvider } from 'react-native-material-palette';
import Toolbar from '../components/Toolbar';
import Fab from '../components/Fab';
import CoverImage from '../components/CoverImage';

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
          image={require('../../assets/cover.jpg')}
          options={{
            type: [
              'muted',
              'vibrant',
              'darkVibrant',
              'lightVibrant',
              'darkMuted',
            ],
          }}
        >
          <View style={styles.container}>
            <Toolbar dark={false} onArrowBackPressed={this.navigateBack} />
            <ScrollView>
              <CoverImage />
              <Text style={styles.paragraph}>
                ‘The Babel fish,’ said The Hitchhiker’s Guide to the Galaxy quietly, ‘is small, yellow, and leech-like, and probably the oddest thing in the Universe. It feeds on brainwave energy received not from its own carrier but from those around it. It absorbs all unconscious mental frequencies from this brainwave energy to nourish itself with. It then excretes into the mind of its carrier a telepathic matrix formed by combining the conscious thought frequencies with nerve signals picked up from the speech centres of the brain which has supplied them. The practical upshot of all this is that if you stick a Babel fish in your ear you can instantly understand anything said to you in any form of language. The speech patterns you actually hear decode the brainwave matrix which has been fed into your mind by your Babel fish.’
              </Text>
            </ScrollView>
            <Fab icon="favorite" />
          </View>
        </MaterialPaletteProvider>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  paragraph: {
    lineHeight: 21,
    color: '#222',
    margin: 16,
    marginBottom: 88,
  },
});
