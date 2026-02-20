package com.paasowork

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.google.firebase.FirebaseApp
import com.google.firebase.messaging.FirebaseMessaging

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    
    // Initialize Firebase FIRST before React Native
    try {
      // Initialize Firebase
      if (FirebaseApp.getApps(this).isEmpty()) {
        FirebaseApp.initializeApp(this)
        android.util.Log.d("MainApplication", "✅ Firebase initialized successfully")
      } else {
        android.util.Log.d("MainApplication", "✅ Firebase already initialized")
      }
      
      // Enable Firebase Messaging auto-init
      FirebaseMessaging.getInstance().isAutoInitEnabled = true
      android.util.Log.d("MainApplication", "✅ FCM auto-init enabled")
      
      // Create notification channel for Android 8.0+
      createNotificationChannel()
      
      // Pre-fetch FCM token to ensure it's ready
      FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
        if (task.isSuccessful) {
          val token = task.result
          android.util.Log.d("MainApplication", "✅ FCM Token ready: ${token?.take(30)}...")
        } else {
          android.util.Log.e("MainApplication", "❌ Failed to get FCM token", task.exception)
        }
      }
      
    } catch (e: Exception) {
      android.util.Log.e("MainApplication", "❌ Firebase initialization failed: ${e.message}", e)
    }
    
    // Load React Native AFTER Firebase is initialized
    loadReactNative(this)
  }
  
  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channelId = getString(R.string.default_notification_channel_id)
      val channelName = getString(R.string.default_notification_channel_name)
      val importance = NotificationManager.IMPORTANCE_HIGH
      
      val channel = NotificationChannel(channelId, channelName, importance).apply {
        description = "PaasoWork notifications for job updates and messages"
        enableVibration(true)
        enableLights(true)
      }
      
      val notificationManager = getSystemService(NotificationManager::class.java)
      notificationManager?.createNotificationChannel(channel)
      
      android.util.Log.d("MainApplication", "✅ Notification channel created: $channelId")
    }
  }
}
