// eslint.config.js
// import {defineConfig} from "eslint/config";

import { defineConfig, globalIgnores } from '@eslint/config-helpers';
import js from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import babelParser from '@babel/eslint-parser';

export default defineConfig([
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'prettier': pluginPrettier,
      'react': pluginReact,
      'react-hooks': pluginReactHooks,
    },
    languageOptions: {
      parser: babelParser,
    },
    rules: {
      'react/prop-types': 'off', // disable if using TS
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': [
        'error',
        {
          quoteProps: 'consistent',
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
          useTabs: false,
        },
      ],
    },
  },
]);
