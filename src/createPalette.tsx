import { Image, type ImageSourcePropType } from 'react-native';
import MaterialPalette from './NativeMaterialPalette';
import type {
  PaletteOptions,
  PaletteTarget,
  PaletteResult,
  PaletteSwatch,
} from './types';

export function getCacheKey(
  source: ImageSourcePropType,
  options: PaletteOptions & { target?: PaletteTarget }
): string {
  const uri = Image.resolveAssetSource(source)?.uri ?? '';

  function serialize(obj: any): string {
    if (obj == null) {
      return '';
    }

    if (typeof obj !== 'object') {
      return String(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(serialize).join(',');
    }

    return Object.entries(obj)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${serialize(v)}`)
      .join(',');
  }

  const optionsStr = serialize(options);

  return [uri, optionsStr].filter(Boolean).join('|');
}

export const paletteCache = new Map<string, PaletteResult>();
export const swatchCache = new Map<string, PaletteSwatch>();

/**
 * Create a color palette from an image source using Android's Palette API.
 *
 * @param source - The image source to extract colors from.
 * @param options - Options for palette generation.
 * @returns A promise that resolves to the palette result.
 */
export async function createPalette(
  source: ImageSourcePropType,
  options: PaletteOptions = {}
): Promise<PaletteResult> {
  const cacheKey = getCacheKey(source, options);
  const cached = paletteCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const uri = Image.resolveAssetSource(source)?.uri;

  if (!uri) {
    throw new Error('Could not resolve image source URI');
  }

  const { maximumColorCount = 16, region } = options;

  const result = await MaterialPalette.createPalette(
    uri,
    maximumColorCount,
    region
  );

  const palette: PaletteResult = {
    vibrant: result.vibrant ?? undefined,
    lightVibrant: result.lightVibrant ?? undefined,
    darkVibrant: result.darkVibrant ?? undefined,
    muted: result.muted ?? undefined,
    lightMuted: result.lightMuted ?? undefined,
    darkMuted: result.darkMuted ?? undefined,
  };

  paletteCache.set(cacheKey, palette);

  return palette;
}

/**
 * Create a color palette swatch from an image source using a custom target.
 *
 * @param source - The image source to extract colors from.
 * @param target - Custom target for color matching.
 * @param options - Options for palette generation.
 * @returns A promise that resolves to the extracted palette swatch.
 */
export async function createPaletteForTarget(
  source: ImageSourcePropType,
  target: PaletteTarget,
  options: PaletteOptions = {}
): Promise<PaletteSwatch> {
  const cacheKey = getCacheKey(source, { ...options, target });
  const cached = swatchCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const uri = Image.resolveAssetSource(source)?.uri;

  if (!uri) {
    throw new Error('Could not resolve image source URI');
  }

  const { maximumColorCount = 16, region } = options;

  const swatch: PaletteSwatch = await MaterialPalette.createPaletteForTarget(
    uri,
    target,
    maximumColorCount,
    region
  );

  swatchCache.set(cacheKey, swatch);

  return swatch;
}
