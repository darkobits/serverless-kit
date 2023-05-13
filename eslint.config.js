import { ts } from '@darkobits/eslint-plugin';


export default [
  ...ts, {
    rules: {
      'unicorn/prefer-ternary': 'off'
    }
  }
];
