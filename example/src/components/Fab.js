/* @flow */

import React from 'react';
// $FlowFixMe
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { withMaterialPalette } from 'react-native-material-palette';

function Fab({ palette, icon, style }) {
  return (
    <FAB
      icon={icon}
      style={[styles.fab, style]}
      color={palette.darkVibrant.bodyTextColor}
    />
  );
}

export default withMaterialPalette(palette => ({
  backgroundColor: palette.darkVibrant.color,
}))(Fab);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
