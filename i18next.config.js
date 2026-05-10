import { defineConfig } from 'i18next-cli'

/** @type {import('i18next-cli').I18nextToolkitConfig} */
export default defineConfig({
  locales: [
    "en",
    "de",
    "es",
    "fr",
    "it",
    "ja",
    "nl",
    "pt",
    "tr"
  ],
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}/{{namespace}}.json"
  }
})