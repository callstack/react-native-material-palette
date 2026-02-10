import { TurboModuleRegistry, type TurboModule } from 'react-native';

export type PaletteRegionSpec = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type PaletteSwatchSpec = {
  /**
   * The main color of the swatch.
   */
  color: string;
  /**
   * The number of pixels represented by this swatch.
   */
  population: number;
  /**
   * A color suitable for body text displayed over the swatch's color.
   */
  bodyTextColor: string;
  /**
   * A color suitable for title text displayed over the swatch's color.
   */
  titleTextColor: string;
};

export type PaletteResultSpec = {
  vibrant: PaletteSwatchSpec | undefined;
  lightVibrant: PaletteSwatchSpec | undefined;
  darkVibrant: PaletteSwatchSpec | undefined;
  muted: PaletteSwatchSpec | undefined;
  lightMuted: PaletteSwatchSpec | undefined;
  darkMuted: PaletteSwatchSpec | undefined;
};

export type PaletteTargetSpec = {
  /**
   * Weight of lightness in color matching.
   */
  lightnessWeight: number;
  /**
   * Maximum lightness value (0-1).
   */
  maximumLightness: number;
  /**
   * Maximum saturation value (0-1).
   */
  maximumSaturation: number;
  /**
   * Minimum lightness value (0-1).
   */
  minimumLightness: number;
  /**
   * Minimum saturation value (0-1).
   */
  minimumSaturation: number;
  /**
   * Weight of population in color matching.
   */
  populationWeight: number;
  /**
   * Weight of saturation in color matching.
   */
  saturationWeight: number;
  /**
   * Target lightness value (0-1).
   */
  targetLightness: number;
  /**
   * Target saturation value (0-1).
   */
  targetSaturation: number;
  /**
   * Whether the target is exclusive, i.e. only one swatch can match this target.
   */
  exclusive: boolean;
};

export interface Spec extends TurboModule {
  createPalette(
    source: string,
    maximumColorCount: number,
    region: PaletteRegionSpec | undefined
  ): Promise<PaletteResultSpec>;

  createPaletteForTarget(
    source: string,
    target: PaletteTargetSpec,
    maximumColorCount: number,
    region: PaletteRegionSpec | undefined
  ): Promise<PaletteSwatchSpec>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MaterialPalette');
