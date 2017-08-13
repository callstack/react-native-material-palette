/* @flow */

import React from 'react';
import { withMaterialPalette } from 'react-native-material-palette';
import { Toolbar as ToolbarPaper } from 'react-native-paper';

function ToolBar({ style, palette, dark, onArrowBackPressed }) {
  return (
    <ToolbarPaper dark={dark} style={style}>
      <ToolbarPaper.Action icon="arrow-back" onPress={onArrowBackPressed} />
      <ToolbarPaper.Content
        title="Screen Details"
        titleStyle={{ color: palette.muted.titleTextColor }}
      />
    </ToolbarPaper>
  );
}

export default withMaterialPalette(palette => ({
  backgroundColor: palette.muted.color,
}))(ToolBar);
