package io.callstack.react_native_material_palette

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.provider.MediaStore
import android.support.v7.graphics.Palette
import android.util.Log
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewManager
import java.io.IOException
import java.net.URL

class PaletteBackgroundManager : ReactViewManager() {

    private val REACT_CLASS = "PaletteBackground"
    private lateinit var ctx: ThemedReactContext
    private lateinit var palette: Palette

    override fun createViewInstance(context: ThemedReactContext): ReactViewGroup {
        ctx = context
        return super.createViewInstance(context)
    }

    override fun getName(): String {
        return REACT_CLASS
    }

//    @ReactProp(name = "source")
//    fun setSource(view: ReactViewGroup, source: ReadableMap) {
//        val bitmap: Bitmap
//        val uri = source.getString("uri")
//        try {
//            if (uri.contains("http")) {
//                val url = URL(uri)
//                // TODO handle network error in case of invalid image
//                bitmap = BitmapFactory.decodeStream(url.openConnection().getInputStream())
//            } else {
//                bitmap = MediaStore.Images.Media.getBitmap(ctx.contentResolver, Uri.parse(uri))
//            }
//            palette = Palette.from(bitmap).generate()
//            view.backgroundColor = palette.getVibrantColor(16777215)
//        } catch(error: IOException) {
//            throw IOException("The URI provided is not an image or the path is incorrect")
//        }
//    }

    @ReactProp(name = "testColor")
    fun setTestColor(view: ReactViewGroup, testColor: Int) {
        view.backgroundColor = testColor
    }
}
