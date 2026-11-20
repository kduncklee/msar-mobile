/* eslint-disable ts/no-require-imports */
const { withAndroidManifest } = require('@expo/config-plugins');

const OPTIONAL_FEATURES = [
  'android.hardware.screen.portrait',
  'android.hardware.wifi',
];

module.exports = function withAndroidOptionalFeatures(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    if (!manifest['uses-feature']) {
      manifest['uses-feature'] = [];
    }

    for (const featureName of OPTIONAL_FEATURES) {
      const existing = manifest['uses-feature'].find(
        item => item.$?.['android:name'] === featureName,
      );
      if (existing) {
        existing.$['android:required'] = 'false';
      }
      else {
        manifest['uses-feature'].push({
          $: {
            'android:name': featureName,
            'android:required': 'false',
          },
        });
      }
    }

    return config;
  });
};
