import { useEffect, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import {
  createPalette,
  createPaletteForTarget,
  getCacheKey,
  paletteCache,
  swatchCache,
} from './createPalette';
import type { PaletteSwatchOptions, PaletteSwatch } from './types';

function getFromCache(
  cacheKey: string,
  type: PaletteSwatchOptions['type']
): PaletteSwatch | undefined {
  if (typeof type === 'string') {
    return paletteCache.get(cacheKey)?.[type];
  }

  return swatchCache.get(cacheKey);
}

/**
 * A hook to get a palette swatch from an image source.
 *
 * Returns `undefined` while loading or if generation fails.
 *
 * To preload palettes, call `createPalette` or `createPaletteForTarget`
 * ahead of time with the same image and options.
 *
 * @param source - The image source to extract colors from.
 * @param options - Options for palette generation.
 * @returns The palette swatch, or `undefined` if loading or on error.
 */
export function usePaletteSwatch(
  source: ImageSourcePropType | undefined,
  options: PaletteSwatchOptions
): PaletteSwatch | undefined {
  const cacheKey = source ? getCacheKey(source, options) : undefined;

  const [state, setState] = useState<
    { key: string; swatch: PaletteSwatch | undefined } | undefined
  >(() => {
    if (cacheKey) {
      return { key: cacheKey, swatch: getFromCache(cacheKey, options.type) };
    }

    return undefined;
  });

  if (state?.key !== cacheKey) {
    setState(
      cacheKey
        ? { key: cacheKey, swatch: getFromCache(cacheKey, options.type) }
        : undefined
    );
  }

  useEffect(() => {
    let ignored = false;

    if (!cacheKey || !source) {
      return;
    }

    const { type, ...paletteOptions } = options;

    if (cacheKey && getFromCache(cacheKey, type)) {
      return;
    }

    const promise =
      typeof type === 'string'
        ? createPalette(source, paletteOptions).then((result) => result[type])
        : createPaletteForTarget(source, type, paletteOptions);

    promise
      .then((result) => {
        if (!ignored) {
          setState({ key: cacheKey, swatch: result });
        }
      })
      .catch(() => {
        // Return undefined on error
      });

    return () => {
      ignored = true;
    };
    // Don't include source and options in deps to frequently retriggering effect
    // The cacheKey already includes options in its calculation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  return state?.swatch;
}
