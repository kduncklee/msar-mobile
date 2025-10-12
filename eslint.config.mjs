import antfu from '@antfu/eslint-config';

export default antfu({
  react: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },

  stylistic: {
    semi: true,
  },
  ignores: [
    'packages/',
  ],
}, {
  rules: {
    'react/no-leaked-conditional-rendering': 'error', // upgrade from warning
    'no-console': 'off',
    'react/no-children-prop': 'off', // Needed for forms
    '@typescript-eslint/no-require-imports': ['error', { allow: ['^@assets/'] }],
    '@typescript-eslint/no-use-before-define': 'off', // allow styles at bottom of JSX component
    /// ///// Enable these later:
    'ts/unbound-method': 'off',
    // types
    'ts/no-unsafe-assignment': 'off',
    'ts/no-unsafe-member-access': 'off',
    'ts/no-unsafe-argument': 'off',
    'ts/no-unsafe-return': 'off',
    'ts/no-unsafe-call': 'off',
    'ts/no-unnecessary-type-assertion': 'off',
    // async/await/promise:
    'ts/no-misused-promises': 'off',
    'ts/no-floating-promises': 'off',
    'ts/await-thenable': 'off',
    'ts/promise-function-async': 'off',
    // bool
    'ts/strict-boolean-expressions': 'off',
  },
});
