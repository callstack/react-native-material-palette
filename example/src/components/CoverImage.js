/* @flow */
/* eslint-disable global-require, react/no-unescaped-entities */

import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { withMaterialPalette } from 'react-native-material-palette';

function Article({ style, palette }) {
  return (
    <View style={[style, { backgroundColor: palette.darkVibrant.color }]}>
      <Image source={require('../../assets/cover.jpg')} style={styles.cover} />
      <View style={[styles.label, { backgroundColor: palette.vibrant.color }]}>
        <Text style={[styles.title, { color: palette.vibrant.titleTextColor }]}>
          Babel Fish
        </Text>
        <Text
          style={[styles.subtitle, { color: palette.vibrant.bodyTextColor }]}
        >
          The Hitchhiker's Guide to the Galaxy
        </Text>
      </View>
    </View>
  );
}

export default withMaterialPalette()(Article);

const styles = StyleSheet.create({
  cover: {
    height: 200,
    width: null,
    resizeMode: 'cover',
  },
  label: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
});
