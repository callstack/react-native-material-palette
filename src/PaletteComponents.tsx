import { createContext, useContext, type PropsWithChildren } from 'react';
import {
  Text,
  View,
  type ImageSourcePropType,
  type TextProps,
  type ViewProps,
} from 'react-native';
import type {
  PaletteSwatchOptions,
  PaletteSwatch,
  PaletteSwatchVariant,
} from './types';
import { usePaletteSwatch } from './usePaletteSwatch';

const NO_PROVIDER = Symbol('NO_PROVIDER');

const PaletteSwatchContext = createContext<
  Omit<PaletteSwatch, 'population'> | undefined | typeof NO_PROVIDER
>(NO_PROVIDER);

export type PaletteViewProps = ViewProps &
  PaletteSwatchOptions & {
    /** The image source to extract colors from. */
    source: ImageSourcePropType;
    /**
     * Determines which color from the swatch to use as the background.
     * Defaults to the main swatch color.
     */
    variant?: PaletteSwatchVariant;
    /**
     * A fallback swatch to use while loading or if generation fails.
     */
    fallback?: Omit<PaletteSwatch, 'population'>;
  };

/**
 * A View that uses a palette swatch color as its background.
 *
 * It also provides the swatch to nested `Palette.Text` components.
 */
function PaletteView({
  source,
  type,
  maximumColorCount,
  region,
  variant = 'color',
  fallback,
  style,
  children,
  ...rest
}: PaletteViewProps) {
  const swatch = usePaletteSwatch(source, { type, maximumColorCount, region });
  const activeSwatch = swatch ?? fallback;

  return (
    <PaletteSwatchContext.Provider value={activeSwatch}>
      <View
        {...rest}
        style={[
          activeSwatch ? { backgroundColor: activeSwatch[variant] } : undefined,
          style,
        ]}
      >
        {children}
      </View>
    </PaletteSwatchContext.Provider>
  );
}

export type PaletteTextProps = TextProps &
  Partial<PaletteSwatchOptions> & {
    /** The image source to extract colors from. Only needed when used standalone (not nested in Palette.View). */
    source?: ImageSourcePropType;
    /**
     * Determines which color from the swatch to use as the text color.
     * Defaults to the body text color.
     */
    variant?: PaletteSwatchVariant;
    /**
     * A fallback swatch to use while loading or if generation fails.
     */
    fallback?: PaletteSwatch;
  };

/**
 * A Text component that uses palette swatch colors.
 *
 * When nested inside `Palette.View`, automatically uses the swatch from the parent.
 * It can be overridden with explicit `source` and `type` props.
 *
 * When not nested inside `Palette.View`, `source` and `type` props are required.
 */
function PaletteText({
  source,
  type,
  maximumColorCount,
  region,
  variant = 'bodyTextColor',
  fallback,
  style,
  children,
  ...rest
}: PropsWithChildren<PaletteTextProps>) {
  const swatch = useContext(PaletteSwatchContext);

  if (swatch === NO_PROVIDER) {
    if (!source || !type) {
      throw new Error(
        'Palette.Text must be nested inside Palette.View or `source` and `type` props must be provided.'
      );
    }

    return (
      <IndependentPaletteText
        source={source}
        type={type}
        maximumColorCount={maximumColorCount}
        region={region}
        variant={variant}
        fallback={fallback}
        style={style}
        {...rest}
      >
        {children}
      </IndependentPaletteText>
    );
  }

  const activeSwatch = swatch ?? fallback;

  return (
    <Text
      {...rest}
      style={[
        activeSwatch ? { color: activeSwatch[variant] } : undefined,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function IndependentPaletteText({
  source,
  type,
  maximumColorCount,
  region,
  variant = 'bodyTextColor',
  fallback,
  style,
  children,
  ...rest
}: PaletteTextProps & {
  source: ImageSourcePropType;
  type: NonNullable<PaletteSwatchOptions['type']>;
}) {
  const swatch = usePaletteSwatch(source, { type, maximumColorCount, region });
  const activeSwatch = swatch ?? fallback;

  return (
    <Text
      {...rest}
      style={[
        activeSwatch ? { color: activeSwatch[variant] } : undefined,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/**
 * Components for using palette colors in views and text.
 *
 * - `Palette.View` - Shows a view with the swatch color as background.
 * - `Palette.Text` - Shows text with colors from the swatch.
 */
export const Palette = {
  View: PaletteView,
  Text: PaletteText,
};
