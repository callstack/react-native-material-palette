package io.callstack.react_native_material_palette

import android.support.v7.graphics.Palette
import com.facebook.react.bridge.*
import com.facebook.react.bridge.ReactApplicationContext
import android.net.Uri
import android.provider.MediaStore
import java.io.IOException
import android.graphics.BitmapFactory
import android.graphics.Bitmap
import java.net.URL

class MaterialPaletteModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val REACT_NAME = "MaterialPalette"
    private val context = reactContext

    override fun getName(): String {
        return REACT_NAME
    }

    private lateinit var palette: Palette

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
                promise.resolve("Palette created successfully")
            })
        } catch(error: IOException) {
            throw IOException("The URI provided is not an image or the path is incorrect")
        }
    }
}
