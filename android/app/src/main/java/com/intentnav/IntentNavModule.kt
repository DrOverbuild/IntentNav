package com.intentnav

import android.content.Intent
import android.net.Uri
import android.os.Parcelable
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class IntentNavModule(private val context: ReactApplicationContext): ReactContextBaseJavaModule(context) {
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