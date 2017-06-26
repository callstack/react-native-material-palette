package io.callstack.react_native_material_palette

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.JavaScriptModule
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import java.util.*
import java.util.Arrays

class MaterialPalettePackage : ReactPackage {

    override fun createJSModules(): MutableList<Class<out JavaScriptModule>> = Collections.emptyList()

    override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule>
            = mutableListOf(MaterialPaletteModule(reactContext))

    override fun createViewManagers(
            reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return Arrays.asList<ViewManager<*, *>>(
                PaletteBackgroundManager()
        )
    }

}
