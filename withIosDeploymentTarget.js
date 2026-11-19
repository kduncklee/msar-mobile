/* eslint-disable ts/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const { IOSConfig, withDangerousMod } = require('@expo/config-plugins');

module.exports = function withIosDeploymentTarget(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const appDelegateInfo = IOSConfig.Paths.getAppDelegate(config.modRequest.projectRoot);
      if (appDelegateInfo.language === 'swift') {
        if (!appDelegateInfo.contents.includes('FirebaseApp.configure()')) {
          let appDelegate = appDelegateInfo.contents;
          if (!appDelegate.includes('import FirebaseCore')) {
            appDelegate = appDelegate.replace(/import Expo/, 'import Expo\nimport FirebaseCore');
          }
          appDelegate = appDelegate.replace(
            /return super\.application\(application, didFinishLaunchingWithOptions: launchOptions\)/,
            'FirebaseApp.configure()\n    return super.application(application, didFinishLaunchingWithOptions: launchOptions)',
          );
          fs.writeFileSync(appDelegateInfo.path, appDelegate);
        }
      }

      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      const fixScript = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        if config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'].to_f < 16.4
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '16.4'
        end
        header_search_paths = config.build_settings['HEADER_SEARCH_PATHS'] || ['$(inherited)']
        header_search_paths = [header_search_paths] if header_search_paths.is_a?(String)
        prebuilt_react_headers = '"$(PODS_XCFRAMEWORKS_BUILD_DIR)/React-Core-prebuilt/React.framework/Headers"'
        unless header_search_paths.include?(prebuilt_react_headers)
          header_search_paths << prebuilt_react_headers
        end
        config.build_settings['HEADER_SEARCH_PATHS'] = header_search_paths
      end
    end
      `;

      if (!podfile.includes('PODS_XCFRAMEWORKS_BUILD_DIR')) {
        podfile = podfile.replace(
          /post_install do \|installer\|/,
          `post_install do |installer|\n${fixScript}`,
        );
        fs.writeFileSync(podfilePath, podfile);
      }

      return config;
    },
  ]);
};
