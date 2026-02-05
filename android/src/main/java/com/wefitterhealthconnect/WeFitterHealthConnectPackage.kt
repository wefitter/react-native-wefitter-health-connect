package com.wefitterhealthconnect

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager

class WeFitterHealthConnectPackage : ReactPackage {

  @Deprecated("Migrate to [BaseReactPackage] and implement [getModule] instead.")
  override fun createNativeModules(
    reactContext: ReactApplicationContext
  ): MutableList<NativeModule> = listOf(WeFitterHealthConnectModule(reactContext)).toMutableList()


  override fun createViewManagers(
    reactContext: ReactApplicationContext
  ): MutableList<ViewManager<View, ReactShadowNode<*>>> = mutableListOf()

}
