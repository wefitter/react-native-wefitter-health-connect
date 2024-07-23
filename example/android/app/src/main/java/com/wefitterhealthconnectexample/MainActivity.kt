package com.wefitterhealthconnectexample

import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.result.ActivityResultCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresApi
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.wefitter.healthconnect.WeFitterHealthConnect.Companion.TAG
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking


class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    Log.d("DEBUG", "Overridden")
    val healthConnectPermissionRequest = registerForActivityResult(
      ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
      Log.i(TAG, "permissions $permissions")

      when {
        permissions.getOrDefault(android.Manifest.permission.ACTIVITY_RECOGNITION, false) -> {
        }

        permissions.getOrDefault(android.Manifest.permission.POST_NOTIFICATIONS, false) -> {
        }

        else -> {
          // No health connect access granted, service can't be started as it will crash
          Toast.makeText(this, "Health permission is required!", Toast.LENGTH_SHORT).show()
        }
      }
    }

    runBlocking {
      healthConnectPermissionRequest.launch(
        arrayOf(
          android.Manifest.permission.ACTIVITY_RECOGNITION,
          android.Manifest.permission.POST_NOTIFICATIONS
        )
      )
      delay(10000L)
    }

    super.onCreate(savedInstanceState)
    Log.d("DEBUG", "After healthConnectPermissionRequest")

   }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String {
        return "WeFitterHealthConnectExample"
    }

    /**
     * Returns the instance of the [ReactActivityDelegate]. Here we use a util class [ ] which allows you to easily enable Fabric and Concurrent React
     * (aka React 18) with two boolean flags.
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(
            this,
          mainComponentName,  // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            fabricEnabled
        )
    }
}
