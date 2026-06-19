```js id="b0y6n5"
import js from "@eslint/js";

import globals from "globals";

import tseslint from "typescript-eslint";

import pluginReact from "eslint-plugin-react";

import { defineConfig } from "eslint/config";

export default defineConfig([

  /* ========================================
     IGNORE FILES
  ======================================== */

  {

    ignores: [

      "dist/**",

      "node_modules/**",

      ".next/**",

      "build/**",

    ],

  },

  /* ========================================
     JAVASCRIPT / TYPESCRIPT
  ======================================== */

  {

    files: [

      "**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"

    ],

    plugins: {

      js,

    },

    extends: [

      "js/recommended"

    ],

    languageOptions: {

      globals: {

        ...globals.browser,

        ...globals.node,

      },

    },

  },

  /* ========================================
     TYPESCRIPT
  ======================================== */

  ...tseslint.configs.recommended,

  /* ========================================
     REACT
  ======================================== */

  pluginReact.configs.flat.recommended,

  /* ========================================
     CUSTOM RULES
  ======================================== */

  {

    rules: {

      "@typescript-eslint/no-explicit-any": "off",

      "@typescript-eslint/no-unused-vars": "off",

      "@typescript-eslint/no-require-imports": "off",

      "react/react-in-jsx-scope": "off",

    },

    settings: {

      react: {

        version: "detect",

      },

    },

  },

]);
```
