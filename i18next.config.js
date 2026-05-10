import { defineConfig } from 'i18next-cli'
import { LANGUAGE_CODES } from './src/languages.js'

/** @type {import('i18next-cli').I18nextToolkitConfig} */
export default defineConfig({
  locales: LANGUAGE_CODES,
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}/{{namespace}}.json"
  }
})
