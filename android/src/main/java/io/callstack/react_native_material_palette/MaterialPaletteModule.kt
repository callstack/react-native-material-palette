package io.callstack.react_native_material_palette

import android.support.v7.graphics.Palette
import com.facebook.react.bridge.*
import com.facebook.react.bridge.ReactApplicationContext
import android.net.Uri
import android.provider.MediaStore
import java.io.IOException
import android.graphics.BitmapFactory
import android.graphics.Bitmap
import android.graphics.Color
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
    fun getColor(color: String, defaultColor: String, promise: Promise) {
        val defaultColorInt = Color.parseColor(defaultColor)
        var targetColor: Int = 16777215 // #FFFFFF for initialization
        when(color) {
            "muted" -> targetColor = palette.getMutedColor(defaultColorInt)
            "vibrant" -> targetColor = palette.getVibrantColor(defaultColorInt)
            "darkMuted" -> targetColor = palette.getDarkMutedColor(defaultColorInt)
            "darkVibrant" -> targetColor = palette.getDarkVibrantColor(defaultColorInt)
            "lightMuted" -> targetColor = palette.getLightMutedColor(defaultColorInt)
            "lightVibrant" -> targetColor = palette.getLightVibrantColor(defaultColorInt)
            else -> {
                throwExceptionWrongColor()
            }
        }
        promise.resolve(getHexColor(targetColor))
    }

    @ReactMethod
    fun getSwatch(color: String, promise: Promise) {
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
        promise.resolve(getSwatchProperties(targetSwatch))
    }

    @ReactMethod
    fun createMaterialPalette(source: ReadableMap, promise: Promise) {
        try {
            val uri = source.getString("uri")
            val bitmap: Bitmap
            if (uri.contains("http")) {
                val url = URL(uri)
                bitmap = BitmapFactory.decodeStream(url.openConnection().getInputStream())
            } else {
                bitmap = MediaStore.Images.Media.getBitmap(context.contentResolver, Uri.parse(uri))
            }
            Palette.from(bitmap).generate({ p: Palette ->
                palette = p
                promise.resolve(true)
            })
        } catch(error: IOException) {
            throw IOException("The URI provided is not an image or the path is incorrect")
        }
    }
}
