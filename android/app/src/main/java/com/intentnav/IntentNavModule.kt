package com.intentnav

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Parcelable
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.lang.StringBuilder

class IntentNavModule(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
  init {
    reactContext?.addActivityEventListener(IntentNavActivityEventListener(reactContext))
  }

  override fun getName(): String {
    return "IntentNavModule"
  }

  @ReactMethod
  public fun getIntentData(promise: Promise) {
    if (currentActivity == null) return;
    val intent = currentActivity!!.intent
    if (intent == null) {
      promise.resolve(null)
      return
    }

    val uri = intent.getParcelableExtra<Parcelable>(Intent.EXTRA_STREAM) as? Uri

    if (uri == null) {
      promise.resolve(null);
      return;
    }

    promise.resolve(uri.path)
  }
}

class IntentNavActivityEventListener(var context: ReactApplicationContext) : ActivityEventListener {

  override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
    println("NOOP on Activity Result")
  }

  override fun onNewIntent(intent: Intent?) {
    println("New intent! ${intent?.action}")
    val map = Arguments.createMap();
    val action = intent?.action
    if (action == null) {
      map.putNull("action")
    } else {
      map.putString("action", action)
    }

    map.putString("uri", intent?.toUri(0))

    if (intent?.type == "text/plain") {
      val stringVal = intent.getStringExtra(Intent.EXTRA_TEXT)
      map.putString("text", intent.getStringExtra(Intent.EXTRA_TEXT))
    } else if (intent?.type?.startsWith("application") == true) {
      val uriStream = intent.getParcelableExtra<Parcelable>(Intent.EXTRA_STREAM) as? Uri
      if (uriStream != null) {
        map.putString("fileContents", loadFileContents(uriStream))
      }
    }

    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onNewIntent", map)
  }

  private fun loadFileContents(uri: Uri?): String? {
    if (uri == null) return null
    if (context.currentActivity == null) return null

    val inputStream = context.currentActivity!!.contentResolver.openInputStream(uri) ?: return null;
    val strBuilder = StringBuilder();
    var byte: Int = 0
    while (true) {
      byte = inputStream.read()
      if (byte == -1) {
        break
      } else {
        strBuilder.append(Char(byte))
      }
    }
    return strBuilder.toString()
  }
}