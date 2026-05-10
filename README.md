# Yesglot React Example

This project is a small Vite + React + `react-i18next` example that shows how a product can ship multilingual UI with JSON translation files and a language switcher.

The app itself is intentionally simple. The real goal is to show a clean translation workflow for React teams, and how that workflow can be connected to [Yesglot](https://yesglot.com/).

## Why this project exists

Most React i18n demos stop at "here is how to call `t('hello')`".

This repo goes one step further:

- It shows how to structure a React app with `i18next`.
- It keeps translations in normal JSON files that your app can load at runtime.
- It demonstrates how a tool like Yesglot can keep those translation files updated as your product changes.

In short: this is not just a translation demo, it is a translation workflow demo.

## What is Yesglot?

Yesglot is an AI-first translation workflow tool for software teams.

At a high level, you connect your repository, add a `yesglot.toml` config file, point it to your source and target translation files, and Yesglot helps generate and maintain translations for the languages you support.

For React apps using `react-i18next`, that usually means:

- your source language lives in a file like `public/locales/en/translation.json`
- your target languages live in files like `public/locales/es/translation.json`
- Yesglot watches the source file for changes
- when new text is added, it opens a pull request with updated target translation files

That means your team can review translation changes in GitHub the same way you review code changes.

## How Yesglot works, simply

1. You connect your GitHub repository to Yesglot.
2. You add a `yesglot.toml` file to the root of the repo.
3. You tell Yesglot which file is the source language and which files are the target languages.
4. You update the source translation file when your app text changes.
5. Yesglot detects the change and creates a pull request with translated files.
6. Your team reviews and merges the PR.

That is the core idea: source strings in your repo, translated output in PRs, and humans still stay in control.

## How to run this project

### Prerequisites

- Node.js 18+ recommended
- npm

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

Then open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## How this example is wired

- [`src/i18n.js`](./src/i18n.js) sets up `i18next`, browser language detection, and JSON loading from `public/locales/{{lng}}/translation.json`.
- [`src/PizzaJustifier.jsx`](./src/PizzaJustifier.jsx) renders the UI and language dropdown.
- [`public/locales/en/translation.json`](./public/locales/en/translation.json) is the source translation file for English.
- `public/locales/<language>/translation.json` is where translated files live for other languages.
- [`i18next.config.js`](./i18next.config.js) is used by `i18next-cli` when generating and syncing locale files.

## How to integrate Yesglot into a React app

This repo already uses `react-i18next`, so the integration is mostly about connecting your translation files to Yesglot.

### 1. Organize your translation files

Keep one source language file and one file per target language.

Example:

```text
public/
  locales/
    en/
      translation.json
    tr/
      translation.json
    fr/
      translation.json
```

In this example app, English is the source language.

If you want `i18next-cli` to create the target language files for you, first make sure the `locales` array in [`i18next.config.js`](./i18next.config.js) contains the languages you want, then run:

```bash
npx i18next-cli sync
```

This command reads your source strings, creates any missing `public/locales/<language>/translation.json` files, and syncs keys across the configured languages.

### 2. Configure `react-i18next`

Set up `i18next` so your app loads translations from those files.

This repo already does that in [`src/i18n.js`](./src/i18n.js):

```js
backend: {
  loadPath: "/locales/{{lng}}/translation.json",
}
```

That means:

- `en` loads from `public/locales/en/translation.json`
- `es` loads from `public/locales/es/translation.json`
- `fr` loads from `public/locales/fr/translation.json`

### 3. Create your project in Yesglot.com

After creating your project in Yesglot, it will connect the GitHub repository and commit the `yesglot.toml` file.

Once connected, Yesglot can watch the branch you configured in `tracked_branch`.

### 4. Update your source translations

When you add or change product copy, update the source file first:

```json
{
  "title": "Pizza Justifier",
  "subtitle": "Enter your circumstances. Receive your verdict."
}
```

Then commit and push that change.

### 5. Let Yesglot open translation PRs

When Yesglot sees changes in the source translation file, it can generate the corresponding target-language updates and open a pull request with those file changes.

Your workflow becomes:

1. Add or update English strings.
2. Push to your tracked branch.
3. Review the Yesglot translation PR.
4. Merge it when the translations look good.

### 7. Add glossary and prompt rules when needed

If your product uses special terminology, you can guide translations with `custom_prompt` and per-language glossaries.

Example:

```toml
[project]
id = "proj_your_project_id"
technology = "react-i18next"
custom_prompt = "This is a playful consumer app. Keep the tone light and natural."

[glossary.tr]
"Pizza Justifier" = "Pizza Justifier"
"Verdict" = "Hukum"
```

This is useful when you want brand names, legal wording, or product terms to stay consistent.

## Recommended workflow for React teams

If you want the simplest setup, use this order:

1. Build your app with `react-i18next`.
2. Keep English as the source of truth.
3. Store translations in `public/locales/<lang>/translation.json`.
4. Add `yesglot.toml`.
5. Let Yesglot create PRs for translation updates.
6. Review translations before merging.

That keeps your localization process close to your normal Git workflow and avoids managing translations in a separate spreadsheet or ad hoc copy-paste process.

## Sources

This README is based on:

- the live Yesglot homepage: [yesglot.com](https://yesglot.com/)
- the public Yesglot config specification: [github.com/yesglot/yesglot.toml](https://github.com/yesglot/yesglot.toml)
