import antfu from '@antfu/eslint-config';

export default antfu({
  react: true,

  stylistic: {
    semi: true,
  },
  ignores: [
    'packages/',
  ],
}, {
  rules: {
    'no-console': 'off',
    'no-restricted-globals': 'off', // allow 'global' for now
    '@typescript-eslint/no-require-imports': ['error', { allow: ['^@assets/'] }],
    '@typescript-eslint/no-use-before-define': 'off', // allow styles at bottom of JSX component
  },
});
