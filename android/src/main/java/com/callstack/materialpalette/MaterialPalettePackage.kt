package com.callstack.materialpalette

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class MaterialPalettePackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == MaterialPaletteModule.NAME) {
      MaterialPaletteModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      mapOf(
        MaterialPaletteModule.NAME to ReactModuleInfo(
          MaterialPaletteModule.NAME, MaterialPaletteModule.NAME, false, false, false, true
        )
      )
    }
  }
}
