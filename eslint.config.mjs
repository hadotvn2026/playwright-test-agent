import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default defineConfig(
  {
    ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**'],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // 1. Luật chung cho cả tests/ và pages/
  {
    files: ['tests/**/*.ts', 'pages/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/missing-playwright-await': 'error',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-element-handle': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/no-raw-locators': ['warn', {
        allowed: ['[data-testid']
      }],
    },
  },

  // 2. Luật kiến trúc POM nghiêm ngặt: Chỉ áp dụng cho thư mục tests/
  {
    files: ['tests/e2e/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='page'][callee.property.name=/^(locator|frameLocator|getByRole|getByTestId|getByText|getByLabel|getByPlaceholder|getByAltText|getByTitle)$/]",
          message: "POM Violation (Locator): Không được gọi locator trực tiếp trên `page` trong `tests/`. Hãy khai báo locator bên trong Page Object class tại thư mục `pages/`."
        },
        {
          selector: "CallExpression[callee.object.name='page'][callee.property.name=/^(click|dblclick|fill|type|press|pressSequentially|check|uncheck|setChecked|selectOption|hover|focus|tap|dragAndDrop|setInputFiles|dispatchEvent)$/]",
          message: "POM Violation (Action): Không được gọi hành động tương tác UI trực tiếp trên `page` trong `tests/`. Hãy đóng gói thành một business behavior method hoàn chỉnh (ví dụ: `loginAs()`, `submitOrder()`) trong Page Object."
        }
      ]
    }
  }
);