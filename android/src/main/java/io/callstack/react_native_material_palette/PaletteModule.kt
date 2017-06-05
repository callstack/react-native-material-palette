package io.callstack.react_native_material_palette

import android.support.v7.graphics.Palette
import com.facebook.react.bridge.*
import android.graphics.BitmapFactory
import android.util.Base64
import com.facebook.react.bridge.ReactApplicationContext

class MaterialPaletteModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val REACT_NAME = "MaterialPalette"

    override fun getName(): String {
        return REACT_NAME
    }

    // Generate palette asynchronously and use it on a different
    // thread using onGenerated()
    @ReactMethod
    fun createMaterialPalette(encodedImage: String, promise: Promise) {
        val decodedString = Base64.decode(encodedImage, Base64.DEFAULT)
        val bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
        Palette
            .from(bitmap)
            .generate {
                promise.resolve(this)
            }
    }
}
