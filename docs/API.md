# API

## `MaterialPaletteProvider`

__Also available from the default import:__ `MaterialPalette.PaletteProvider`

### Example of usage:
```javascript
import React from 'react';
import { View } from 'react-native';
import { MaterialPaletteProvider } from 'react-native-material-palette';

import PaletteAwareComponent from './PaletteAwareComponent';

class App extends React.Component {
  render() {
    return (
      <MaterialPaletteprovider
        image={require('../assets/image.png')}
        options={{
          type: ['vibrant', 'muted']
        }}
      >
        <View>
          <PaletteAwareComponent />
        </View>
      </MaterialPaletteprovider>
    );
  }
}
```

> You can import the component directly, as a named import:
> ```javascript
> import { MaterialPaletteProvider } from 'react-native-material-palette';
> ```
> or using the default import and accessing the component using `PaletteProvider` property:
> ```javascript
> import MaterialPalette from 'react-native-material-palette';
> // MaterialPalette.PaletteProvider
> ```

### Props
* `image: Image` (__required__) - Local image to create palette from (`require('path/to/image')`) or object with remote URI adress from which the image can be downloaded (`{ uri: 'http://some-domain.ext/image.png' }`) - same as `image` in `MaterialPalette.create` function.

* `options?: Options` (optional) - Options for palette creation - same as `options` in `MaterialPalette.create` function:
  ```javascript
  type Options = {
    region?: { top: number, left: number, bottom: number, right: number },
    maximumColorCount?: number = 16,
    type?: ColorProfile = 'vibrant',
    types?: Array<ColorProfile> = []
  }
  ```

* `defaults?: PaletteDefaults` (optional) - Global defaults which will be propagated to each _connected_ component along side with palette instance, which will be used if the specific color profile is not found:
  ```javascript
  type ColorProfile =
    | 'muted'
    | 'vibrant'
    | 'darkMuted'
    | 'darkVibrant'
    | 'lightMuted'
    | 'lightVibrant';
  
  type DefaultSwatch = {
    color: string,
    bodyTextColor: string,
    titleTextColor: string,
  };

  type PaletteDefaults = {
    [key: ColorProfile]: DefaultSwatch,
  };
  ```

* `waitForPalette?: boolean | React$Component<*, *, *>` (optional) - If specified, while waiting for palette to be created, will render either `null` (if `waitForPalette === true`) or the passed component:
  * `<MateriaPaletteProvider waitForPalette>` - will render `null`,
  * `<MateriaPaletteProvider waitForPalette={true}>` - will render `null`,
  * `<MateriaPaletteProvider waitForPalette={SpinnerComponent}>` - will render `SpinnerComponent`,
  * `<MateriaPaletteProvider waitForPalette={() => <Text>Loading</Text>)}>` - will render `Text` component with _Loading_.

* `onError?: (error: Error) => void` (optional) - Error handler, called if the palette failed to generate.

* `onInit?: () => void` - (optional) - Init handler, called when the `MaterialPaletteProvider` is just about to start creating the palette.

* `onFinish?: (palette: PaletteInstance, globalDefaults: PaletteDefaults) => void` - (optional) - Finish handler, called when the palette is created, but before it gets propagated to _connected_ components - use it, if you want to mutate the palette instance.

* `children: React$Element<*>`, - (__required__) - Children elements - the rest of your app's component tree.
