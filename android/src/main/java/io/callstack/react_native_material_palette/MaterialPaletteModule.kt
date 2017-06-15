package io.callstack.react_native_material_palette

import android.support.v7.graphics.Palette
import com.facebook.react.bridge.*
import com.facebook.react.bridge.ReactApplicationContext
import android.net.Uri
import android.provider.MediaStore
import java.io.IOException
import android.graphics.BitmapFactory
import android.graphics.Bitmap
import android.support.v7.graphics.Target
import java.net.URL

class MaterialPaletteModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val REACT_NAME = "MaterialPalette"
    private val context = reactContext

    override fun getName(): String {
        return REACT_NAME
    }

    private lateinit var palette: Palette

    fun throwExceptionWrongColor() {
        throw RuntimeException("The color provided is not valid. It must be one of types 'muted', " +
                "'vibrant', 'darkMuted', 'darkVibrant', 'lightMuted' or 'lightVibrant")
    }

    fun getHexColor(rgbInt: Int): String = String.format("#%06X", 0xFFFFFF and rgbInt)

    fun targetMap(target: String): Target? {
        return when(target) {
            "muted" -> Target.MUTED
            "vibrant" -> Target.VIBRANT
            "darkMuted" -> Target.DARK_MUTED
            "darkVibrant" -> Target.DARK_VIBRANT
            "lightMuted" -> Target.LIGHT_MUTED
            "lightVibrant" -> Target.LIGHT_VIBRANT
            else -> {
                null
            }
        }
    }

    fun getSwatchProperties(swatch: Palette.Swatch?): WritableMap {
        val swatchMap = Arguments.createMap()
        val population = swatch?.population ?: 0
        val bodyTextColor = swatch?.bodyTextColor ?: 0
        val titleTextColor = swatch?.titleTextColor ?: 0
        val rgbColor = swatch?.rgb ?: 0

        swatchMap.putInt("population", population)
        swatchMap.putString("color", getHexColor(rgbColor))
        swatchMap.putString("bodyTextColor", getHexColor(bodyTextColor))
        swatchMap.putString("titleTextColor", getHexColor(titleTextColor))

        return swatchMap
    }

    @ReactMethod
    fun getSwatch(color: String): WritableMap {
        var targetSwatch: Palette.Swatch? = Palette.Swatch(0, 0)
        when(color) {
            "muted" -> targetSwatch = palette.mutedSwatch
            "vibrant" -> targetSwatch = palette.vibrantSwatch
            "darkMuted" -> targetSwatch = palette.darkMutedSwatch
            "darkVibrant" -> targetSwatch = palette.darkVibrantSwatch
            "lightMuted" -> targetSwatch = palette.lightMutedSwatch
            "lightVibrant" -> targetSwatch = palette.lightVibrantSwatch
            else -> {
                throwExceptionWrongColor()
            }
        }
        return getSwatchProperties(targetSwatch)
    }

    @ReactMethod
    fun createMaterialPalette(source: ReadableMap, options: ReadableMap, promise: Promise) {
        try {
            val uri = source.getString("uri")
            val region = options.getMap("region")
            val top = region.getInt("top")
            val right = region.getInt("right")
            val bottom = region.getInt("bottom")
            val left = region.getInt("left")
            val maxColorCount = options.getInt("maximumColorCount")
            val type = options.getString("type")
            val types = options.getArray("types")
            val bitmap: Bitmap

            if (uri.contains("http")) {
                val url = URL(uri)
                // TODO handle network error in case of invalid image
                bitmap = BitmapFactory.decodeStream(url.openConnection().getInputStream())
            } else {
                bitmap = MediaStore.Images.Media.getBitmap(context.contentResolver, Uri.parse(uri))
            }

            var builder: Palette.Builder = Palette.from(bitmap).maximumColorCount(maxColorCount)

            if (left != 0 || top != 0 || right != 0 || bottom != 0) {
                builder = builder.setRegion(left, top, right, bottom)
            }

            if (types.size() == 0) {
                val target = targetMap(type)
                if (target != null) {
                    builder = builder.addTarget(target)
                } else {
                    throwExceptionWrongColor()
                }
            } else {
                for (t in Array(types.size(), { i -> targetMap(types.getString(i))})) {
                    if (t != null) {
                        builder = builder.addTarget(t)
                    } else {
                        throwExceptionWrongColor()
                    }
                }
            }

            builder.generate({ p: Palette ->
                palette = p
                val returnMap = Arguments.createMap()

                if (types.size() == 0) {
                    returnMap.putMap(type, getSwatch(type))
                } else {
                    val targets: Array<String> = Array(types.size(), { i -> types.getString(i)})
                    for (t in targets) {
                        returnMap.putMap(t, getSwatch(t))
                    }
                }
                promise.resolve(returnMap)
            })

        } catch(error: IOException) {
            throw IOException("The URI provided is not an image or the path is incorrect")
        }
    }
}
