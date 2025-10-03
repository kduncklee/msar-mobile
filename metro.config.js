/* eslint-disable ts/no-require-imports */
const {
  withExpoSerializers,
} = require('@expo/metro-config/build/serializer/withExpoSerializers');
const { createSentryMetroSerializer } = require('@sentry/react-native/metro');
const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('metro');

const config = getDefaultConfig(__dirname);

const sentryConfig = {
  serializer: {
    customSerializer: createSentryMetroSerializer(),
  },
};

const finalConfig = mergeConfig(config, sentryConfig);
module.exports = withExpoSerializers(finalConfig);
