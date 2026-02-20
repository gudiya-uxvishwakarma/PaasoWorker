package com.paasowork

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(TAG, "🔄 New FCM token: $token")
        
        // Send token to your backend server
        sendTokenToServer(token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        Log.d(TAG, "📩 Message received from: ${remoteMessage.from}")
        
        // Check if message contains a notification payload
        remoteMessage.notification?.let {
            Log.d(TAG, "📬 Notification Title: ${it.title}")
            Log.d(TAG, "📬 Notification Body: ${it.body}")
            
            // Show notification
            showNotification(it.title ?: "PaasoWork", it.body ?: "")
        }
        
        // Check if message contains a data payload
        if (remoteMessage.data.isNotEmpty()) {
            Log.d(TAG, "📦 Data payload: ${remoteMessage.data}")
            handleDataPayload(remoteMessage.data)
        }
    }

    private fun showNotification(title: String, body: String) {
        val channelId = getString(R.string.default_notification_channel_id)
        
        // Create notification channel for Android 8.0+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                getString(R.string.default_notification_channel_name),
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "PaasoWork notifications"
                enableVibration(true)
                enableLights(true)
            }
            
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager?.createNotificationChannel(channel)
        }
        
        // Create intent to open app when notification is tapped
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        
        // Build notification
        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle(title)
            .setContentText(body)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()
        
        // Show notification
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager?.notify(System.currentTimeMillis().toInt(), notification)
        
        Log.d(TAG, "✅ Notification displayed")
    }

    private fun handleDataPayload(data: Map<String, String>) {
        // Handle custom data payload
        Log.d(TAG, "📦 Handling data payload: $data")
        
        // You can add custom logic here based on data payload
        // For example: navigate to specific screen, update local data, etc.
    }

    private fun sendTokenToServer(token: String) {
        // TODO: Send token to your backend server
        Log.d(TAG, "📤 Sending token to server: $token")
    }

    companion object {
        private const val TAG = "FCMService"
    }
}
