#import "NotificationService.h"
#import <MMKVAppExtension/MMKV.h>

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
  self.contentHandler = contentHandler;
  self.bestAttemptContent = [request.content mutableCopy];
  
  NSLog(@"didReceiveNotificationRequest %@, %@", self.bestAttemptContent.title, self.bestAttemptContent.body);

  NSString *myGroupID = @"group.org.malibusar.app.shared";
  // the group dir that can be accessed by App & extensions
  NSString *groupDir = [[NSFileManager defaultManager] containerURLForSecurityApplicationGroupIdentifier:myGroupID].path;
  [MMKV initializeMMKV:nil groupDir:groupDir logLevel:MMKVLogError];
  
  MMKV *mmkv = [MMKV mmkvWithID:@"mmkv.shared" mode:MMKVMultiProcess];
  double badgeCount = [mmkv getDoubleForKey:@"badgeCount"] + 1;
  [mmkv setDouble:badgeCount forKey:@"badgeCount"];
  NSString *channel = self.bestAttemptContent.userInfo[@"channel"];
  NSString *logType = self.bestAttemptContent.userInfo[@"logType"];
  NSString *attending = self.bestAttemptContent.userInfo[@"attending"];
  if ([logType isEqualToString:@"response"]) {
    channel = [attending isEqualToString:@"True"] ? @"callout-response-yes" : @"callout-response-no";
  }
  NSString *sound = [mmkv getStringForKey:[NSString stringWithFormat:@"sound-%@", channel]];
  if ([sound isEqualToString:@"none"]) {
    NSLog(@"No notification");
    return;
  }
  NSString *soundFile = [NSString stringWithFormat:@"%@.mp3", sound];
  BOOL critical = [mmkv getBoolForKey:[NSString stringWithFormat:@"critical-%@", channel]];
  NSLog(@"channel: %@, %@", channel, sound);
  
  double snoozeExpiresMs = [mmkv getDoubleForKey:@"snoozeExpires"];
  NSTimeInterval currentSec = [[NSDate date] timeIntervalSince1970];
  BOOL snoozing = (snoozeExpiresMs - (currentSec * 1000.0)) > 0;
  NSLog(@"%f <?> %f", currentSec * 1000.0, snoozeExpiresMs);

  snoozing |= [sound hasPrefix:@"silent"]; // allow suffix for android channel name

  self.bestAttemptContent.badge = [NSNumber numberWithInt:badgeCount];

  if (snoozing) {
    NSLog(@"No sound due to snoozing or silent");
  } else {
    self.bestAttemptContent.sound = [UNNotificationSound soundNamed:soundFile];
    if (critical) {
      double volume = [mmkv getDoubleForKey:@"critical-alert-volume"];
      if (@available(iOS 12.0, *)) {
        self.bestAttemptContent.sound = [UNNotificationSound criticalSoundNamed:soundFile withAudioVolume:volume];
        NSLog(@"critical: %f, %@", volume, sound);
      }
    }
  }

  self.contentHandler(self.bestAttemptContent);
}

- (void)serviceExtensionTimeWillExpire {
  // Called just before the extension will be terminated by the system.
  // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
  self.contentHandler(self.bestAttemptContent);
}

@end
