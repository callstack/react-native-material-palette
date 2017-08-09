// @flow

import React from 'react';
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { withMaterialPalette } from 'react-native-material-palette';

function Fab({ palette, icon }) {
  const backgroundColor = palette.muted.color;
  return <FAB icon={icon} style={[styles.fab, { backgroundColor }]} />;
}

export default withMaterialPalette()(Fab);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    top: 275,
    right: 8,
  },
});
