package com.callstack.materialpalette

import android.graphics.Bitmap
import android.util.LruCache
import androidx.core.net.toUri
import androidx.palette.graphics.Palette
import androidx.palette.graphics.Target
import com.facebook.common.references.CloseableReference
import com.facebook.datasource.DataSources
import com.facebook.drawee.backends.pipeline.Fresco
import com.facebook.imagepipeline.image.CloseableBitmap
import com.facebook.imagepipeline.image.CloseableImage
import com.facebook.imagepipeline.request.ImageRequestBuilder
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import java.util.concurrent.CompletableFuture
import java.util.concurrent.ConcurrentHashMap

class MaterialPaletteModule(reactContext: ReactApplicationContext) :
  NativeMaterialPaletteSpec(reactContext) {

  private val cache = LruCache<String, WritableMap>(100)
  private val futures = ConcurrentHashMap<String, CompletableFuture<WritableMap>>()

  override fun createPalette(
    source: String, maximumColorCount: Double, region: ReadableMap?, promise: Promise
  ) {
    generatePalette(source, maximumColorCount, region, null) { palette ->
      Arguments.createMap().apply {
        putSwatch("vibrant", palette.vibrantSwatch)
        putSwatch("lightVibrant", palette.lightVibrantSwatch)
        putSwatch("darkVibrant", palette.darkVibrantSwatch)
        putSwatch("muted", palette.mutedSwatch)
        putSwatch("lightMuted", palette.lightMutedSwatch)
        putSwatch("darkMuted", palette.darkMutedSwatch)
      }
    }.thenAccept { result ->
      promise.resolve(copyWritableMap(result))
    }.exceptionally { e ->
      promise.reject("ERR_PALETTE", e.cause?.message ?: e.message, e)
      null
    }
  }

  override fun createPaletteForTarget(
    source: String,
    targetSpec: ReadableMap,
    maximumColorCount: Double,
    region: ReadableMap?,
    promise: Promise
  ) {
    val target =
      Target.Builder().setLightnessWeight(targetSpec.getDouble("lightnessWeight").toFloat())
        .setMaximumLightness(targetSpec.getDouble("maximumLightness").toFloat())
        .setMaximumSaturation(targetSpec.getDouble("maximumSaturation").toFloat())
        .setMinimumLightness(targetSpec.getDouble("minimumLightness").toFloat())
        .setMinimumSaturation(targetSpec.getDouble("minimumSaturation").toFloat())
        .setPopulationWeight(targetSpec.getDouble("populationWeight").toFloat())
        .setSaturationWeight(targetSpec.getDouble("saturationWeight").toFloat())
        .setTargetLightness(targetSpec.getDouble("targetLightness").toFloat())
        .setTargetSaturation(targetSpec.getDouble("targetSaturation").toFloat())
        .setExclusive(targetSpec.getBoolean("exclusive")).build()

    generatePalette(source, maximumColorCount, region, targetSpec, target) { palette ->
      val swatch = palette.getSwatchForTarget(target)
        ?: throw Exception("No swatch found for the given target")

      swatchToMap(swatch)
    }.thenAccept { result ->
      promise.resolve(copyWritableMap(result))
    }.exceptionally { e ->
      val message = e.cause?.message ?: e.message

      if (message == "No swatch found for the given target") {
        promise.reject("ERR_NO_SWATCH", message, e)
      } else {
        promise.reject("ERR_PALETTE", message, e)
      }
      null
    }
  }

  private fun generatePalette(
    source: String,
    maximumColorCount: Double,
    region: ReadableMap?,
    targetSpec: ReadableMap?,
    target: Target? = null,
    toResult: (Palette) -> WritableMap
  ): CompletableFuture<WritableMap> {
    val cacheKey = buildCacheKey(source, maximumColorCount, region, targetSpec)

    cache.get(cacheKey)?.let {
      return CompletableFuture.completedFuture(it)
    }

    return futures.computeIfAbsent(cacheKey) {
      val future = CompletableFuture<WritableMap>()

      val bitmap = loadBitmap(source) ?: run {
        futures.remove(cacheKey)
        return@computeIfAbsent CompletableFuture.failedFuture(
          Exception("Failed to load image from: $source")
        )
      }

      val builder = Palette.Builder(bitmap).maximumColorCount(maximumColorCount.toInt())

      if (target != null) {
        builder.addTarget(target)
      }

      if (region != null) {
        builder.setRegion(
          region.getInt("left"),
          region.getInt("top"),
          region.getInt("right"),
          region.getInt("bottom")
        )
      }

      builder.generate { palette ->
        try {
          if (palette == null) {
            throw Exception("Failed to generate palette")
          }

          val result = toResult(palette)

          cache.put(cacheKey, result)
          future.complete(result)
        } catch (e: Exception) {
          future.completeExceptionally(e)
        } finally {
          futures.remove(cacheKey)
          bitmap.recycle()
        }
      }

      future
    }
  }

  private fun loadBitmap(source: String): Bitmap? {
    val uri = source.toUri()
    val imageRequest = ImageRequestBuilder.newBuilderWithSource(uri).build()
    val dataSource =
      Fresco.getImagePipeline().fetchDecodedImage(imageRequest, reactApplicationContext)

    try {
      val result: CloseableReference<CloseableImage> =
        DataSources.waitForFinalResult(dataSource) ?: return null

      try {
        val closeableImage = result.get()

        if (closeableImage is CloseableBitmap) {
          return closeableImage.underlyingBitmap.copy(Bitmap.Config.ARGB_8888, false)
        }

        return null
      } finally {
        CloseableReference.closeSafely(result)
      }
    } finally {
      dataSource.close()
    }
  }

  private fun colorToRgba(color: Int): String {
    val a = (color ushr 24 and 0xFF) / 255f
    val r = color ushr 16 and 0xFF
    val g = color ushr 8 and 0xFF
    val b = color and 0xFF

    return if (a == 1f) "rgb($r, $g, $b)" else "rgba($r, $g, $b, $a)"
  }

  private fun swatchToMap(swatch: Palette.Swatch) = Arguments.createMap().apply {
    putString("color", colorToRgba(swatch.rgb))
    putInt("population", swatch.population)
    putString("bodyTextColor", colorToRgba(swatch.bodyTextColor))
    putString("titleTextColor", colorToRgba(swatch.titleTextColor))
  }

  private fun WritableMap.putSwatch(key: String, swatch: Palette.Swatch?) {
    if (swatch != null) {
      putMap(key, swatchToMap(swatch))
    } else {
      putNull(key)
    }
  }

  private fun buildCacheKey(
    source: String, maximumColorCount: Double, region: ReadableMap?, targetSpec: ReadableMap?
  ): String {
    val regionStr = region?.let {
      "${it.getInt("left")},${it.getInt("top")},${it.getInt("right")},${it.getInt("bottom")}"
    } ?: ""

    val targetStr = targetSpec?.let {
      "${it.getDouble("lightnessWeight")},${it.getDouble("maximumLightness")}," + "${it.getDouble("maximumSaturation")},${
        it.getDouble(
          "minimumLightness"
        )
      }," + "${it.getDouble("minimumSaturation")},${it.getDouble("populationWeight")}," + "${
        it.getDouble(
          "saturationWeight"
        )
      },${it.getDouble("targetLightness")}," + "${it.getDouble("targetSaturation")},${
        it.getBoolean(
          "exclusive"
        )
      }"
    } ?: ""

    return "$source:$maximumColorCount:$regionStr:$targetStr"
  }

  private fun copyWritableMap(source: WritableMap): WritableMap {
    return Arguments.createMap().apply {
      merge(source)
    }
  }

  companion object {
    const val NAME = NativeMaterialPaletteSpec.NAME
  }
}
