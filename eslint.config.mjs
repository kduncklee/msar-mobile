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
    'react/no-children-prop': 'off', // Needed for forms
    '@typescript-eslint/no-require-imports': ['error', { allow: ['^@assets/'] }],
    '@typescript-eslint/no-use-before-define': 'off', // allow styles at bottom of JSX component
  },
});
