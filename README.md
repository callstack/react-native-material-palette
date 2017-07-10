# react-native-material-palette

> 

<a title="Join on Slack" href="https://slack.callstack.io"><img src="https://slack.callstack.io/badge.svg" /></a>

## Install

Installation and setup guide can be found here: [Setup guide](./docs/SETUP.md).

## Usage As API

### `create()`

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
  type?: ColorProfile = 'vibrant',
  types?: Array<ColorProfile> = []
}

type Swatch = {
  population: number, // number of pixels
  color: string, // color for swatch,
  bodyTextColor: string, // appropriate color to use for any 'body' text
  titleTextColor: string, // appropriate color to use for any 'title' text
}

PaletteInstance = {
  [key: ColorProfile]: ?Swatch,
};

create: (image: Image, options?: Options) => Promise<PaletteInstance>
```

#### Examples

##### Creating a palette from a network resource, with 'vibrant' color profile, maximumColorCount = 16 and the whole region of the image (default behaviour) 
```js
import MaterialPalette from "react-native-material-palette";

const palette = await MaterialPalette.create({ uri: 'http://dummySite/images/yummy.jpg' });
```

##### Creating a palette from an internal image asset, with 'muted' and 'lightVibrant' color profiles, maximumColorCount = 32 and a specific region of the image
```js
import MaterialPalette from "react-native-material-palette";

const palette = await MaterialPalette.create(require('./assets/image.jpg'), {
  region: { top: 0, left: 0, bottom: 50, right: 50},
  maximumColorCount: 32,
  types: ['muted', 'lightVibrant'],
});
```

## Development

Development instructions can be found here: [`react-native-material-palette` development](./docs/DEVELOPMENT.md).

## License

[MIT](./LICENSE)
