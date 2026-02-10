import type {
  PaletteRegionSpec,
  PaletteSwatchSpec,
  PaletteTargetSpec,
  PaletteResultSpec,
} from './NativeMaterialPalette';

export type PaletteOptions = {
  /**
   * The maximum number of colors in your palette.
   * The default is 16, and the optimal value depends on the source image.
   * For landscapes, optimal values range from 8-16,
   * while pictures with faces usually have values from 24-32.
   */
  maximumColorCount?: number;
  /**
   * The area of the image to use for palette generation.
   * If not specified, the entire image is used.
   */
  region?: PaletteRegionSpec;
};

export type PaletteSwatch = PaletteSwatchSpec;

export type PaletteTarget = PaletteTargetSpec;

/**
 * Built-in swatch type names.
 */
export type PaletteSwatchType = keyof PaletteResult;

/**
 * Options for extracting a single swatch from an image.
 * Used by hooks and components that need a specific swatch type.
 */
export type PaletteSwatchOptions = PaletteOptions & {
  /**
   * Color target for color matching.
   *
   * Can be one of the preset targets or a custom target object:
   * - `'vibrant'` - A vibrant color from the image.
   * - `'lightVibrant'` - A light and vibrant color.
   * - `'darkVibrant'` - A dark and vibrant color.
   * - `'muted'` - A muted color from the image.
   * - `'lightMuted'` - A light and muted color.
   * - `'darkMuted'` - A dark and muted color.
   *
   * Or an object with custom target values for fine-grained control
   * over the color matching process.
   */
  type: PaletteSwatchType | PaletteTarget;
};

export type PaletteResult = {
  [K in keyof PaletteResultSpec]: PaletteSwatch | undefined;
};

/**
 * Determines which color from the swatch to use.
 * - `'color'` - Uses the main swatch color.
 * - `'titleTextColor'` - Uses the title text color of the swatch.
 * - `'bodyTextColor'` - Uses the body text color of the swatch.
 */
export type PaletteSwatchVariant = 'color' | 'titleTextColor' | 'bodyTextColor';
