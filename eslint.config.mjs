import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactNative from "eslint-plugin-react-native";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const tsFiles = ["**/*.{ts,tsx}"];
const mobileFiles = ["apps/mobile/**/*.{ts,tsx}"];
const nodeFiles = ["apps/api/**/*.ts", "packages/shared/**/*.ts"];
const testFiles = ["**/*.{test,spec}.ts", "packages/shared/tests/**/*.ts"];

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "apps/mobile/.expo/**",
      "apps/mobile/assets/**",
      "coverage/**"
    ]
  },
  {
    files: tsFiles,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    files: nodeFiles,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022
      }
    }
  },
  {
    files: mobileFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022
      }
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-native": reactNative
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-native/no-inline-styles": "off",
      "react-native/no-unused-styles": "error"
    }
  },
  {
    files: testFiles,
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
];
