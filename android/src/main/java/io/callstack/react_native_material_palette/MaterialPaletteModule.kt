package io.callstack.react_native_material_palette

import android.content.Context
import android.support.v7.graphics.Palette
import com.facebook.react.bridge.*
import android.support.v7.graphics.Target
import com.facebook.react.bridge.ReactApplicationContext
import android.net.Uri
import android.provider.MediaStore

class MaterialPaletteModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val REACT_NAME = "MaterialPalette"

    override fun getName(): String {
        return REACT_NAME
    }

    private lateinit var palette: Palette

    @ReactMethod
    fun createMaterialPalette(imageUri: String, promise: Promise) {
        promise.resolve("Palette created!")
    }
}
