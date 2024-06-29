/* eslint-disable ts/no-require-imports */
const { mergeConfig } = require('metro');
const { getDefaultConfig } = require('expo/metro-config');
const { createSentryMetroSerializer } = require('@sentry/react-native/metro');
const {
  withExpoSerializers,
} = require('@expo/metro-config/build/serializer/withExpoSerializers');

const config = getDefaultConfig(__dirname);

const sentryConfig = {
  serializer: {
    customSerializer: createSentryMetroSerializer(),
  },
};

const finalConfig = mergeConfig(config, sentryConfig);
module.exports = withExpoSerializers(finalConfig);
