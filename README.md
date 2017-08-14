# react-native-material-palette

> 

<a title="Join on Slack" href="https://slack.callstack.io"><img src="https://slack.callstack.io/badge.svg" /></a> [![CircleCI](https://circleci.com/gh/callstack-io/react-native-material-palette/tree/master.svg?style=shield)](https://circleci.com/gh/callstack-io/react-native-material-palette/tree/master) [![Coverage Status](https://coveralls.io/repos/github/callstack-io/react-native-material-palette/badge.svg?branch=master)](https://coveralls.io/github/callstack-io/react-native-material-palette?branch=master)

## Install

Installation and setup guide can be found here: [Setup guide](./docs/SETUP.md).

## Usage with `MaterialPaletteProvider` and `withMaterialPalette`

```javascript
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

The API documentation can be found here: [API documntation](./docs/API.md).

## Usage As API

### `createMaterialPalette()`

```js
// Number is the opaque type returned by require('./image.jpg')
type Image = number | { uri: string }

type ColorProfile =
  | 'muted'
  | 'vibrant'
  | 'darkMuted'
  | 'darkVibrant'
  | 'lightMuted'
  | 'lightVibrant'

type Options = {
  region?: { top: number, left: number, bottom: number, right: number },
  maximumColorCount?: number = 16,
  type?: ColorProfile | Array<ColorProfile> = 'vibrant',
}

type Swatch = {
  population: number, // number of pixels
  color: string, // color for swatch,
  bodyTextColor: string, // appropriate color to use for any 'body' text
  titleTextColor: string, // appropriate color to use for any 'title' text
}

type DefaultSwatch = {
  color: string,
  bodyTextColor: string,
  titleTextColor: string,
};

type PaletteDefaults = {
  [key: ColorProfile]: DefaultSwatch,
};

PaletteInstance = {
  [key: ColorProfile]: ?Swatch,
};

createMaterialPalette: (image: Image, options?: Options, defaults?: PaletteDefaults) => Promise<PaletteInstance>
```

#### Examples

##### Creating a palette from a network resource, with 'vibrant' color profile, maximumColorCount = 16 and the whole region of the image (default behaviour) 
```js
import { createMaterialPalette } from "react-native-material-palette";

const palette = await createMaterialPalette({ uri: 'http://dummySite/images/yummy.jpg' });
```

##### Creating a palette from an internal image asset, with 'muted' and 'lightVibrant' color profiles, maximumColorCount = 32 and a specific region of the image
```js
import { createMaterialPalette } from "react-native-material-palette";

const palette = await createMaterialPalette(require('./assets/image.jpg'), {
  region: { top: 0, left: 0, bottom: 50, right: 50},
  maximumColorCount: 32,
  type: ['muted', 'lightVibrant'],
});
```

##### Creating a palette from an internal image asset and custom defaults
```js
import { createMaterialPalette } from "react-native-material-palette";

const palette = await createMaterialPalette(
  require('./assets/image.jpg'),
  {
    type: ['lightVibrant', 'darkMuted'],
  },
  {
    darkMuted: {
      color: '#000000',
      bodyTextColor: '#B2B2B2',
      titleTextColor: '#F4F4F4',
    },
  },
);
```

## Development

Development instructions can be found here: [`react-native-material-palette` development](./docs/DEVELOPMENT.md).

## License

[MIT](./LICENSE)
