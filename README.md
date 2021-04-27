# svelte-preprocess-import-assets

Import assets directly in your templates.

Convert this:

```svelte
<h1>Look at this image</h1>
<img src="./assets/cool-image.png" alt="cool image" />
```

Into this:

```svelte
<script>
  import __ASSET__0 from './assets/cool-image.png'
</script>

<h1>Look at this image</h1>
<img src={__ASSET__0} alt="cool image" />
```

## Usage

Install with your package manager:

```bash
npm install svelte-preprocess-import-assets
```

Include the preprocessor in your bundler's Svelte plugin `preprocess` option:

```js
import importAssets from 'svelte-preprocess-import-assets'

svelte({ preprocess: [importAssets()] })
```

[Here is more information](https://github.com/sveltejs/svelte-preprocess/blob/9e587151e9384b819d7b285caba7231c138942f0/docs/usage.md) on how to integrate it with your bundler.

## API

The `importAssets()` function has an optional parameter that receives an option object:

```js
importAssets({
  // The sources to look for when scanning for imports
  sources: (defaultSources) => {
    return [
      ...defaultSources,
      {
        tag: 'img',
        srcAttrs: ['data-src'],
        srcsetAttrs: ['data-srcset'],
      },
    ]
  },
  // Change the import name, e.g. `import __CUSTOM_IMPORT_PREFIX__0 from './assets/cool-image.png'`
  importPrefix: '__CUSTOM_IMPORT_PREFIX__',
  // Whether should convert to import
  urlFilter: (url) => !url.endsWith('pdf'),
})
```

Ignore importing asset for an element:

```svelte
<!-- svelte-preprocess-import-assets-ignore -->
<img src="./assets/cool-image.png" alt="cool image" />
```

## License

MIT
