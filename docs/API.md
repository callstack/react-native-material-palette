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

### Description
`MaterialPaletteprovider` is a component, which handles palette creation and provides the access to the palette instance to _connected_ components (via `withMaterialPalette`) using context. Ideally `MaterialPaletteprovider` should be placed at the top of components tree, so that all nested components can _conect_ to it.
The concept is very similar to `Provider` component from `react-redux`.

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

--------------

## `withMaterialPalette`

__Also available from the default import:__ `MaterialPalette.withPalette`

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

> You can import the function directly, as a named import:
> ```javascript
> import { withMaterialPalette } from 'react-native-material-palette';
> ```
> or using the default import and accessing the component using `withPalette` property:
> ```javascript
> import MaterialPalette from 'react-native-material-palette';
> // MaterialPalette.withPalette
> ```

### Description
`withMaterialPalette` is a Higher Order Component (HOC), which allows to seemlessy connect to `MaterialPaletteProvider` and get the palette instance via context.

It is a function factory (it returns a new function), similarily to `connect` from `react-redux`, to allow to be used as a decorator:
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

`withMaterialPalette` passes palette instance as a `palette` prop to the _connected_ component, so that you can directly use it and apply a custom logic. However, for most common use case, which is applying colors to properties in `style`, the function accepts `mapPaletteToStyles` function as a first argument.

`mapPaletteToStyles` must be a function, which takes single argument - palette instance and returns a valid `style` object. It will be later passed (and optionaly merged with other `style` prop) to the _connected_ component.

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

  <MaterialPaletteprovider defaults={{
    vibrant: {
      color: '#3792dd',
      bodyTextColor: '#ffffff',
      titleTextColor: '#ffffff',
    },
  }}>
    <PaletteView />
  </MaterialPaletteprovider>
  // PaletteView will have color applied from local defaults:
  //   [{ backgroundColor: '#18b247' }]
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

// Pass color to Button component
const PaletteButton = withMaterialPalette()(props => {
  const { palette, ...rest } = props;
  return <Button {...rest} color={palette.vibrant.color} />;
});

// Pass color to Button component with defaults
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
