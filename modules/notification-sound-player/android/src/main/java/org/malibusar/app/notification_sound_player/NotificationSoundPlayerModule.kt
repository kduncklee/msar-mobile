package org.malibusar.app.notification_sound_player

import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NotificationSoundPlayerModule : Module() {
  private var mediaPlayer : MediaPlayer? = null

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('NotificationSoundPlayer')` in JavaScript.
    Name("NotificationSoundPlayer")

    AsyncFunction("playNotificationSound") { sound: String ->
      if (mediaPlayer == null) {
        mediaPlayer = MediaPlayer()
      } else {
        mediaPlayer?.reset();
      }

      mediaPlayer?.setAudioAttributes(AudioAttributes.Builder()
        .setFlags(AudioAttributes.FLAG_AUDIBILITY_ENFORCED)
        .setLegacyStreamType(AudioManager.STREAM_ALARM)
        .setUsage(AudioAttributes.USAGE_ALARM)
        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
        .build())

      //mediaPlayer?.setAudioStreamType(AudioManager.STREAM_ALARM)
      mediaPlayer?.setDataSource(sound)
      mediaPlayer?.setLooping(false)
      mediaPlayer?.prepare()
      mediaPlayer?.start()
    }

  }
}
