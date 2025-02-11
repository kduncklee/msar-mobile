// Import the native module. On web, it will be resolved to NotificationSoundPlayer.web.ts
// and on native platforms to NotificationSoundPlayer.ts
import NotificationSoundPlayerModule from './src/NotificationSoundPlayerModule';

export async function playNotificationSound(sound: string) {
  return await NotificationSoundPlayerModule.playNotificationSound(sound);
}
