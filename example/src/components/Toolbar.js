// @flow

import React from 'react';
import { withMaterialPalette } from 'react-native-material-palette';
import { Toolbar as ToolbarPaper } from 'react-native-paper';

function ToolBar({ style, dark, onArrowBackPressed }) {
  return (
    <ToolbarPaper style={style}>
      <ToolbarPaper.Action
        icon="keyboard-backspace"
        onPress={onArrowBackPressed}
      />
      <ToolbarPaper.Content title="Screen Details" dark={dark} />
    </ToolbarPaper>
  );
}

export default withMaterialPalette(palette => ({
  backgroundColor: palette.lightVibrant.color,
}))(ToolBar);
