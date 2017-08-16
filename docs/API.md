# API

## `createMaterialPalette()`

```js
createMaterialPalette(
  image: Image,
  options?: Options,
  defaults?: PaletteDefaults,
): Promise<PaletteInstance>

// Number is the opaque type returned by require('./image.jpg')
type Image = number | { uri: string }

type Options = {
  region?: { top: number, left: number, bottom: number, right: number },
  maximumColorCount?: number = 16,
  type?: ColorProfile | Array<ColorProfile> = 'vibrant',
}

type PaletteDefaults = {
  [key: ColorProfile]: DefaultSwatch,
};

type PaletteInstance = {
  [key: ColorProfile]: ?Swatch,
};

type Swatch = {
  population: number, // number of pixels
  color: string, // color for swatch,
  bodyTextColor: string, // appropriate color to use for any 'body' text
  titleTextColor: string, // appropriate color to use for any 'title' text
}

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

```

### Description
`createMaterialPalette` is a function that returns a Promise that when resolved, will provide a palette instance with color information about the image provided.

### Arguments
* `image: Image` (__required__) - Local image to create palette from (`require('path/to/image')`) or object with remote URI adress from which the image can be downloaded (`{ uri: 'http://some-domain.ext/image.png' }`).

* `options?: Options` (optional) - Options for palette creation.
  * `region` - Indicates what area of the bitmap the builder uses when creating the palette.
  * `maximumColorCount` - Sets the maximum number of colors in your palette. The default value is 16, and the optimal value depends on the source image. For landscapes, optimal values range from 8-16 while pictures with faces usually have values that fall between 24-32.
  * `type` - Color profiles we aim to target. Defaults to `vibrant`
  

* `defaults?: PaletteDefaults` (optional) - Defaults which will be used, if the specific color profile is not found.

### Examples

#### Creating a palette from a network resource, with 'vibrant' color profile, maximumColorCount = 16 and the whole region of the image (default behaviour) 
```js
import { createMaterialPalette } from "react-native-material-palette";

const palette = await createMaterialPalette({ uri: 'http://dummySite/images/yummy.jpg' });
```

#### Creating a palette from an internal image asset, with 'muted' and 'lightVibrant' color profiles, maximumColorCount = 32 and a specific region of the image
```js
import { createMaterialPalette } from "react-native-material-palette";

const palette = await createMaterialPalette(require('./assets/image.jpg'), {
  region: { top: 0, left: 0, bottom: 50, right: 50},
  maximumColorCount: 32,
  type: ['muted', 'lightVibrant'],
});
```

#### Creating a palette from an internal image asset and custom defaults
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

## `MaterialPaletteProvider`

### Example of usage:
```javascript
import React from 'react';
import { View } from 'react-native';
import { MaterialPaletteProvider } from 'react-native-material-palette';

import PaletteAwareComponent from './PaletteAwareComponent';

class App extends React.Component {
  render() {
    return (
      <MaterialPaletteProvider
        image={require('../assets/image.png')}
        options={{
          type: ['vibrant', 'muted']
        }}
      >
        <View>
          <PaletteAwareComponent />
        </View>
      </MaterialPaletteProvider>
    );
  }
}
```

### Description
`MaterialPaletteProvider` is a component, which handles palette creation and provides the access to the palette instance for _connected_ components (via `withMaterialPalette`) using context. Ideally, `MaterialPaletteProvider` should be placed at the top of components tree, so that all nested components can _connect_ to it. By default it will render `null` when the palette is being created unless either `forceRender` or `LoaderComponent` is specified.

The concept is very similar to `Provider` component from `react-redux`.

### Props
* `image: Image` (__required__) - same as `image` in `createMaterialPalette` function.

* `options?: Options` (optional) - same as `options` in `createMaterialPalette` function.

* `defaults?: PaletteDefaults` (optional) - Global defaults which will be propagated to each _connected_ component, alongside with palette instance, which will be used, if the specific color profile is not found.

* `forceRender?: boolean` (optional) - Forces to render the children regardless whether the palette is being created. __Does not take effect if `LoaderComponent` is specified!__

* `LoaderComponent: React$Component<*, *, *> | ((...args: *) => React$Element<*>)` (optional) - If specified, will render the passed component while waiting for palette to be created:
  * `<MateriaPaletteProvider LoaderComponent={SpinnerComponent}>` - will render `SpinnerComponent`,
  * `<MateriaPaletteProvider LoaderComponent={() => <Text>Loading</Text>)}>` - will render `Text` component with _Loading_.

* `onError?: (error: Error) => void` (optional) - Error handler, called if the palette failed to create.

* `onFinish?: (palette: PaletteInstance) => void` - (optional) - Finish handler, called when the palette is created, but before it gets propagated to _connected_ components - use it, if you want to mutate the palette instance. If some profiles are not available for the provided image, the defaults will apply, taking precedence the ones you passed to the component as `this.props.defaults`.

* `children: React$Element<*>`, - (__required__) - Children elements - the rest of your app's component tree.

--------------

## `withMaterialPalette`

### Example of usage:
```javascript
import React from 'react';
import { Text } from 'react-native';
import { withMaterialPalette } from 'react-native-material-palette';

export default withMaterialPalette(
  palette => ({
    backgroundColor: palette.vibrant.color,
    color: palette.vibrant.bodyTextColor,
  })
)(Text);
```

### Description
`withMaterialPalette` is a function that returns a Higher Order Component (HOC), which allows to seamlessly _connect_ to the `MaterialPaletteProvider` and get the palette instance via context.

Under the hood, it is a function factory (it returns a new function), similarily to `connect` from `react-redux`, to allow to be used as a decorator:
```javascript
@withMaterialPalette(
  palette => ({
    backgroundColor: palette.vibrant.color,
    color: palette.vibrant.bodyTextColor,
  })
)
export default class MyComponent extends React.Component {
  // ...
};
```

`withMaterialPalette` passes palette instance as a `palette` prop to the _connected_ component, so that you can directly use it and apply a custom logic. However, for the most common use case, which is applying colors to properties in `style`, it accepts `mapPaletteToStyles` function as a first argument.

`mapPaletteToStyles` takes single argument - palette instance and must return a valid `style` object. It will be later passed (and optionaly merged with other `style` prop) to the _connected_ component.

### Syntax
```javascript
function withMaterialPalette(
  mapPaletteToStyle: ?(palette: PaletteInstance) => {
    [key: string]: mixed,
  },
  localDefaults?: PaletteDefaults
) => (WrappedComponent: ReactClass<*>) => React$Component<*, *, *>;
```

### Arguments
* `mapPaletteToStyle?: (palette: PaletteInstance) => { [key: string]: mixed }` - (optional) - Function to create `style` object with colors from palette applied to properties, which will be passed to the _connected_ component as a `style` prop. The created object will be merged with other `style` prop, if passed to the _connected_ component:
  ```javascript
  const PaletteView = withMaterialPalette(
    palette => ({ backgroundColor: palette.vibrant.color })
  )(View);

  // later ...

  <PaletteView style={{ flex: 1 }} />
  // PaletteView will contain both style objects:
  //   [{ flex: 1 }, { backgroundColor: '#3792dd' }]
  ```

* `localDefaults?: PaletteDefaults` - (optional) - Defaults to apply, if the sepcific color profile was not found, which are local to the component, meaning they overwrites global defaults from `MaterialPaletteProvider` and are not shared:
  ```javascript
  const PaletteView = withMaterialPalette(
    palette => ({ backgroundColor: palette.vibrant.color }),
    {
      vibrant: {
        color: '#18b247',
        bodyTextColor: '#ffffff',
        titleTextColor: '#ffffff',
      },
    }
  )(View);

  // later ...

  <MaterialPaletteProvider defaults={{
    vibrant: {
      color: '#3792dd',
      bodyTextColor: '#ffffff',
      titleTextColor: '#ffffff',
    },
  }}>
    <PaletteView />
    {/*
    PaletteView will have the color applied from local defaults:
      [{ backgroundColor: '#18b247' }]
    */}
  </MaterialPaletteProvider>
  ```

### Examples
```javascript
// Using multiple color profiles
const PaletteView = withMaterialPalette(
  ({ vibrant, muted }) => ({
    backgroundColor: vibrant.color,
    borderColor: muted.color,
  })
)(View);

// Pass color to the Button component
const PaletteButton = withMaterialPalette()(props => {
  const { palette, ...rest } = props;
  return <Button {...rest} color={palette.vibrant.color} />;
});

// Pass color to the Button component with defaults
const PaletteButton = withMaterialPalette(
  null,
  {
    vibrant: {
      color: '#3792dd',
      bodyTextColor: '#ffffff',
      titleTextColor: '#ffffff',
    },
  }
)(props => {
  const { palette, ...rest } = props;
  return <Button {...rest} color={palette.vibrant.color} />;
});
```
