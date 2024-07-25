package com.wefitterhealthconnect

import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.wefitter.healthconnect.WeFitterHealthConnect
import com.wefitter.healthconnect.WeFitterHealthConnectError
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import kotlin.reflect.KProperty0
import kotlin.reflect.jvm.isAccessible

class WeFitterHealthConnectModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  val KProperty0<*>.isLazyInitialized: Boolean
    get() {
      // Prevent IllegalAccessException from JVM access check
      isAccessible = true
      return (getDelegate() as Lazy<*>).isInitialized()
    }

  private val weFitter by lazy { WeFitterHealthConnect(currentActivity as AppCompatActivity) }

  override fun getName(): String {
    return "WeFitterHealthConnect"
  }

  init {
    Log.d("LAZYTEST", "WeFitterHealthConnectModule init")
    if(!this::weFitter.isLazyInitialized) {
      Log.e("LAZYTEST", "wefitter NOT isLazyInitialized")
    } else {
      Log.d("LAZYTEST", "wefitter IS isLazyInitialized")
    }
  }

  @ReactMethod
  fun configure(config: ReadableMap) {
    val token = config.getString("token") ?: ""
    val apiUrl = config.getString("apiUrl")
    val statusListener = object : WeFitterHealthConnect.StatusListener {
      override fun onConfigured(configured: Boolean) {
        sendEvent(
          reactContext,
          "onConfiguredWeFitterHealthConnect",
          Arguments.createMap().apply { putBoolean("configured", configured) })
      }

      override fun onConnected(connected: Boolean) {
        sendEvent(
          reactContext,
          "onConnectedWeFitterHealthConnect",
          Arguments.createMap().apply { putBoolean("connected", connected) })
      }

      override fun onError(error: WeFitterHealthConnectError) {
        sendEvent(
          reactContext,
          "onErrorWeFitterHealthConnect",
          Arguments.createMap().apply { putString("error", error.message) })
      }
    }
    val notificationConfig = parseNotificationConfig(config)
    val startDate = parseStartDate(config)
    val appPermissions = parseAppPermission(config)

    Log.d("LAZYTEST", "wefitter $weFitter")
    weFitter.configure(token, apiUrl, statusListener, notificationConfig, startDate, appPermissions)
  }

  @ReactMethod
  fun connect() {
    weFitter.connect()
  }

  @ReactMethod
  fun disconnect() {
    weFitter.disconnect()
  }

  @ReactMethod
  fun isConnected(callback: Callback) {
    callback(weFitter.isConnected())
  }

  @ReactMethod
  fun isSupported(callback: Callback) {
    callback(weFitter.isSupported())
  }

  private fun parseNotificationConfig(config: ReadableMap): WeFitterHealthConnect.NotificationConfig {
    return WeFitterHealthConnect.NotificationConfig().apply {
      config.getString("notificationTitle")?.let { title = it }
      config.getString("notificationText")?.let { text = it }
      config.getString("notificationIcon")?.let {
        val resourceId = getResourceId(it)
        if (resourceId != 0) iconResourceId = resourceId
      }
      config.getString("notificationChannelId")?.let { channelId = it }
      config.getString("notificationChannelName")?.let { channelName = it }
    }
  }

  private fun parseStartDate(config: ReadableMap): Date? {
    val startDateString = config.getString("startDate")
    if (startDateString != null) {
      val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
      sdf.timeZone = TimeZone.getTimeZone("UTC")
      return sdf.parse(startDateString)
    }
    return null
  }

  private fun getResourceId(resourceName: String): Int {
    val resources = reactContext.resources
    val packageName = reactContext.packageName
    var resourceId = resources.getIdentifier(resourceName, "mipmap", packageName)
    if (resourceId == 0) {
      resourceId = resources.getIdentifier(resourceName, "drawable", packageName)
    }
    if (resourceId == 0) {
      resourceId = resources.getIdentifier(resourceName, "raw", packageName)
    }
    return resourceId
  }

  private fun parseAppPermission(config: ReadableMap): Set<String> {
    val appPermsString: String? = config.getString("appPermissions")
    if (appPermsString != null) {
      val appPerms: Set<String> = appPermsString.split(',').toSet()
      return appPerms
    }
    return emptySet()
  }


  private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

}
