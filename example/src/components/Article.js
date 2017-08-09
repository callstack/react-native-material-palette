// @flow

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { withMaterialPalette } from 'react-native-material-palette';

function Article({ style, palette }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={{ color: palette.lightMuted.bodyTextColor }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam commodo suscipit libero eu pharetra. Integer sit amet placerat ante, in venenatis quam. Maecenas tempus maximus erat, eget aliquam justo sollicitudin vitae. Pellentesque auctor mollis ligula ut dignissim. Mauris quis nunc justo. Fusce nec laoreet tellus. Sed enim purus, ornare vitae consectetur at, fermentum in orci. Suspendisse hendrerit neque neque.

        Aliquam turpis lorem, convallis nec ipsum eu, cursus blandit velit. Nullam eget lorem nec leo commodo cursus. Proin tristique interdum ullamcorper.

      </Text>
    </View>
  );
}

export default withMaterialPalette(palette => ({
  backgroundColor: palette.lightMuted.color,
}))(Article);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
