module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // Forces Babel to transpile modern JS features like #private fields
          // for engines/tools that don't support ES2022 private class syntax
          unstable_transformProfile: 'default',
        },
      ],
    ],
    plugins: ['react-native-reanimated/plugin'],
  };
};
