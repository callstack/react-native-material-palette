# react-native-material-palette

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]


[![PRs Welcome][prs-welcome-badge]][prs-welcome]
[![Chat][chat-badge]][chat]
[![Code of Conduct][coc-badge]][coc]

[Android Palette API](https://developer.android.com/training/material/palette-colors.html) brought to react native. It extracts prominent colors from images to help you create visually engaging apps. At the moment it only supports Android.

Check out [this medium article](https://blog.callstack.io/colour-your-apps-in-react-native-using-material-palette-35448df91958) for a broader introduction!

## Installation

Installation and setup guide can be found here: [Setup guide](./docs/SETUP.md).

## Usage with `createMaterialPalette`

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

## API
Full API documentation can be found here: [API documentation](./docs/API.md).

## Future work
- [ ] iOS support
- [ ] Providing own color profiles

## Example app
The repo includes an example app that covers all the API cases. Go [here](./example) to try it out!

![image](https://user-images.githubusercontent.com/4982414/29513573-0f5acf5a-8666-11e7-989e-30409a50cb8c.png)

![image](https://user-images.githubusercontent.com/4982414/29513689-5f64b4ac-8666-11e7-86fc-0eeea7813630.png)

## Development

Development instructions can be found here: [`react-native-material-palette` development](./docs/DEVELOPMENT.md).

<!-- badges -->
[build-badge]: https://img.shields.io/circleci/project/github/callstack/react-native-material-palette/master.svg?style=flat-square
[build]: https://circleci.com/gh/callstack/react-native-material-palette
[coverage-badge]: https://img.shields.io/coveralls/github/callstack-io/react-native-material-palette.svg?style=flat-square
[coverage]: https://coveralls.io/github/callstack-io/react-native-material-palette?branch=master
[version-badge]: https://img.shields.io/npm/v/react-native-material-palette.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-native-material-palette
[license-badge]: https://img.shields.io/npm/l/react-native-material-palette.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/callstack/react-native-material-palette/blob/master/CODE_OF_CONDUCT.md
[chat-badge]: https://img.shields.io/discord/426714625279524876.svg?style=flat-square&colorB=758ED3
[chat]: https://discord.gg/zwR2Cdh
