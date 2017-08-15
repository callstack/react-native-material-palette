# react-native-material-palette

> 

<a title="Join on Slack" href="https://slack.callstack.io"><img src="https://slack.callstack.io/badge.svg" /></a> [![CircleCI](https://circleci.com/gh/callstack-io/react-native-material-palette/tree/master.svg?style=shield)](https://circleci.com/gh/callstack-io/react-native-material-palette/tree/master) [![Coverage Status](https://coveralls.io/repos/github/callstack-io/react-native-material-palette/badge.svg?branch=master)](https://coveralls.io/github/callstack-io/react-native-material-palette?branch=master)

[Android Palette API](https://developer.android.com/training/material/palette-colors.html) brought to react native. It extracts prominent colors from images to help you create visually engaging apps.

## Installation

Installation and setup guide can be found here: [Setup guide](./docs/SETUP.md).

## Usage as direct palette generation, `createMaterialPalette`

```js
import { createMaterialPalette } from "react-native-material-palette";

const palette = await createMaterialPalette({ uri: 'http://dummySite/images/yummy.jpg' });
```

## Usage with `MaterialPaletteProvider` and `withMaterialPalette`

```js
import { MaterialPaletteProvider, withMaterialPalette } from 'react-native-material-palette';

const PaletteView = withMaterialPalette(
  palette => ({ backgroundColor: palette.vibrant.color }),
)(View);

// later ...

<MaterialPaletteProvider
  image={require('../assets/image.png')}
  options={{
    type: 'vibrant',
  }}
  defaults={{
    vibrant: {
      color: '#3792dd',
      bodyTextColor: '#ffffff',
      titleTextColor: '#ffffff',
    },
  }}
>
  <PaletteView style={{ flex: 1 }}>
    <Text>Hello World</Text>
  </PaletteView>
</MaterialPaletteProvider>
```

The API documentation can be found here: [API documentation](./docs/API.md).

## Example app
The repo includes an example app that covers all the API cases. Go [here](./example) to try it out!

![image](https://user-images.githubusercontent.com/4982414/29331952-92fd2cfc-81fe-11e7-9ef3-25f0e17a0c62.png)

![image](https://user-images.githubusercontent.com/4982414/29332055-f2e25ffc-81fe-11e7-87de-3473d2d74573.png)

## Development

Development instructions can be found here: [`react-native-material-palette` development](./docs/DEVELOPMENT.md).

## License

[MIT](./LICENSE)
