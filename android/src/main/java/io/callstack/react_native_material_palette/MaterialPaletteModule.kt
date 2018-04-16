package io.callstack.react_native_material_palette

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.provider.MediaStore
import android.support.v7.graphics.Palette
import android.support.v7.graphics.Target
import com.facebook.common.executors.CallerThreadExecutor
import com.facebook.common.internal.Closeables
import com.facebook.common.memory.PooledByteBuffer
import com.facebook.common.memory.PooledByteBufferInputStream
import com.facebook.common.references.CloseableReference
import com.facebook.datasource.BaseDataSubscriber
import com.facebook.datasource.DataSource
import com.facebook.drawee.backends.pipeline.Fresco
import com.facebook.imagepipeline.common.ImageDecodeOptions
import com.facebook.imagepipeline.request.ImageRequest.RequestLevel
import com.facebook.imagepipeline.request.ImageRequestBuilder
import com.facebook.react.bridge.*
import java.io.IOException

class MaterialPaletteModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val REACT_NAME = "MaterialPalette"
    private val ERR_INVALID_URI = "ERR_INVALID_URI"
    private val ERR_DOWNLOAD = "ERR_DOWNLOAD"

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

    fun getPalettesFromImage(image: Bitmap, options: ReadableMap, callback: (result: WritableMap) -> Unit) {
        val region = options.getMap("region")
        val top = region.getInt("top")
        val right = region.getInt("right")
        val bottom = region.getInt("bottom")
        val left = region.getInt("left")
        val maxColorCount = options.getInt("maximumColorCount")
        val types = options.getArray("type")

        var builder: Palette.Builder = Palette.from(image).maximumColorCount(maxColorCount)

        if (left != 0 || top != 0 || right != 0 || bottom != 0) {
            builder = builder.setRegion(left, top, right, bottom)
        }

        for (t in Array(types.size(), { i -> targetMap(types.getString(i))})) {
            if (t != null) {
                builder = builder.addTarget(t)
            } else {
                throwExceptionWrongColor()
            }
        }

        builder.generate({ p: Palette ->
            palette = p
            val returnMap = Arguments.createMap()

            val targets: Array<String> = Array(types.size(), { i -> types.getString(i)})
            for (t in targets) {
                returnMap.putMap(t, getSwatch(t))
            }

            callback(returnMap)
        })
    }

    @ReactMethod
    fun createMaterialPalette(source: ReadableMap, options: ReadableMap, promise: Promise) {
        val uri: Uri

        try {
            uri = Uri.parse(source.getString("uri"))
        } catch(error: IOException) {
            promise.reject(ERR_INVALID_URI, "The URI provided is not valid")
            return
        }

        if (uri.scheme == "http" || uri.scheme == "https") {
            val decodeOptions = ImageDecodeOptions.newBuilder()
                    .build()
            val imageRequest = ImageRequestBuilder
                    .newBuilderWithSource(uri)
                    .setImageDecodeOptions(decodeOptions)
                    .setLowestPermittedRequestLevel(RequestLevel.FULL_FETCH)
                    .build()

            val imagePipeline = Fresco.getImagePipeline()
            val dataSource = imagePipeline.fetchEncodedImage(imageRequest, reactApplicationContext)

            val dataSubscriber = object: BaseDataSubscriber<CloseableReference<PooledByteBuffer>>() {
                override fun onNewResultImpl(dataSource: DataSource<CloseableReference<PooledByteBuffer>>) {
                    if (!dataSource.isFinished) {
                        return
                    }

                    val result = dataSource.result

                    if (result == null) {
                        promise.reject(ERR_DOWNLOAD, "Failed to download image")
                        return
                    }

                    val inputStream = PooledByteBufferInputStream(result.get())

                    try {
                        val bitmap = BitmapFactory.decodeStream(inputStream)
                        getPalettesFromImage(bitmap, options, {
                            result ->
                            promise.resolve(result)
                        })
                    } catch (e: Exception) {
                        promise.reject(e)
                    } finally {
                        Closeables.closeQuietly(inputStream)
                    }
                }

                override fun onFailureImpl(dataSource: DataSource<CloseableReference<PooledByteBuffer>>) {
                    promise.reject(dataSource.failureCause)
                }
            }

            dataSource.subscribe(dataSubscriber, CallerThreadExecutor.getInstance())
        } else {
            try {
                val bitmap = MediaStore.Images.Media.getBitmap(reactApplicationContext.contentResolver, uri)

                getPalettesFromImage(bitmap, options, {
                    result ->
                    promise.resolve(result)
                })
            } catch (e: Exception) {
                promise.reject(e)
            }
        }
    }
}
