# Changelog

## 1.1.0 - 2023-11-11

- Support Svelte 5
- Add `estree-walker` as dependency to support Svelte 5

## 1.0.1 - 2023-06-23

- Support Svelte 4

## 1.0.0 - 2023-04-07

- **BREAKING:** use named export instead of default export

```js
// Before
import importAssets from 'svelte-preprocess-import-assets'

// After
import { importAssets } from 'svelte-preprocess-import-assets'
```

- Export ESM only
- Fix incorrect filter metadata value (https://github.com/bluwy/svelte-preprocess-import-assets/issues/17)

## 0.2.6 - 2023-02-23

- Handle actual attributes only. Ignore spread, actions, etc.
- Add `types` export condition
- Update `magic-string` to 0.30.0

## 0.2.5 - 2022-12-10

- Update `magic-string` to 0.27.0

## 0.2.4 - 2022-12-01

- `link` `imagesrcset` should not be processed if have valid `itemprop` for `href` only

## 0.2.3 - 2022-11-25

- Fix CJS usage

## 0.2.2 - 2022-10-11

- Support component names in sources

## 0.2.1 - 2022-10-03

- Update docs

## 0.2.0 - 2022-10-02

- Use `svelte-parse-markup` to parse Svelte template without sequence trick

## 0.1.6 - 2022-02-08

### Fixed

- Handle `srcset` without width, e,g. `./foo.mp4, ./bar.mp4 1v`

## 0.1.5 - 2022-01-15

### Fixed

- Handle `src` attribute for `video` tags

## 0.1.4 - 2022-01-14

### Fixed

- Skip URL that starts with a hash

## 0.1.3 - 2021-08-22

### Fixed

- Ignore attributes with mustache value

## 0.1.2 - 2021-05-07

### Fixed

- Always scan through the entire source list

## 0.1.1 - 2021-05-01

### Added

- Add `http` option

## 0.1.0 - 2021-05-01

Initial release
