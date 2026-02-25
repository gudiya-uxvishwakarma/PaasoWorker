package com.paasowork

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    companion object {
        private const val TAG = "FCMService"
        private const val CHANNEL_ID = "paaso_default_channel"
        private const val CHANNEL_NAME = "PaasoWork Notifications"
        private const val CHANNEL_DESCRIPTION = "Notifications for job alerts and updates"
    }

    /**
     * Called when a new FCM token is generated
     */
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(TAG, "🔄 New FCM token generated: ${token.take(30)}...")
        
        // TODO: Send token to backend
        // This will be handled by the React Native layer
        // You can also implement native token registration here if needed
    }

    /**
     * Called when a message is received
     * This handles notifications when app is in BACKGROUND or TERMINATED state
     */
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        Log.d(TAG, "📩 Message received from: ${remoteMessage.from}")
        
        // Check if message contains a notification payload
        remoteMessage.notification?.let { notification ->
            Log.d(TAG, "   Notification Title: ${notification.title}")
            Log.d(TAG, "   Notification Body: ${notification.body}")
            
            // Display notification
            sendNotification(
                title = notification.title ?: "PaasoWork",
                body = notification.body ?: "",
                data = remoteMessage.data
            )
        }
        
        // Check if message contains a data payload
        if (remoteMessage.data.isNotEmpty()) {
            Log.d(TAG, "   Data payload: ${remoteMessage.data}")
            
            // If no notification payload, create one from data
            if (remoteMessage.notification == null) {
                val title = remoteMessage.data["title"] ?: "PaasoWork"
                val body = remoteMessage.data["body"] ?: "You have a new notification"
                
                sendNotification(
                    title = title,
                    body = body,
                    data = remoteMessage.data
                )
            }
        }
    }

    /**
     * Create and show a notification
     */
    private fun sendNotification(title: String, body: String, data: Map<String, String>) {
        Log.d(TAG, "🔔 Creating notification: $title")
        
        // Create notification channel (required for Android 8.0+)
        createNotificationChannel()
        
        // Create intent to open app when notification is clicked
        val intent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            
            // Add data payload to intent
            data.forEach { (key, value) ->
                putExtra(key, value)
            }
        }
        
        val pendingIntentFlags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        } else {
            PendingIntent.FLAG_ONE_SHOT
        }
        
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            pendingIntentFlags
        )
        
        // Get default notification sound
        val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        
        // Build notification
        val notificationBuilder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher) // Use app icon
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setSound(defaultSoundUri)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
        
        // Show notification
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val notificationId = System.currentTimeMillis().toInt() // Unique ID for each notification
        
        notificationManager.notify(notificationId, notificationBuilder.build())
        
        Log.d(TAG, "✅ Notification displayed successfully")
    }

    /**
     * Create notification channel for Android 8.0+
     */
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = CHANNEL_DESCRIPTION
                enableLights(true)
                enableVibration(true)
            }
            
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
            
            Log.d(TAG, "✅ Notification channel created: $CHANNEL_ID")
        }
    }
}
