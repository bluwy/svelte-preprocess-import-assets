import { parse, walk } from 'svelte/compiler'
import { PreprocessorGroup } from 'svelte/types/compiler/preprocess'
import MagicString from 'magic-string'

export interface ImportAssetsOptions {
  sources?: AssetSource[] | ((defaultSources: AssetSource[]) => AssetSource[])
  importPrefix?: string
  http?: boolean
  urlFilter?: (url: string) => boolean
}

export interface AssetSource {
  tag: string
  srcAttributes?: string[]
  srcsetAttributes?: string[]
  filter?: (metadata: FilterMetadata) => boolean
}

export interface FilterMetadata {
  tag: string
  attribute: string
  value: string
  attributes: Record<string, string>
}

export default function importAssets(
  options: ImportAssetsOptions = {}
): PreprocessorGroup {
  let {
    sources = DEFAULT_SOURCES,
    importPrefix = DEFAULT_ASSET_PREFIX,
    http = false,
    urlFilter,
  } = options

  if (typeof sources === 'function') {
    sources = sources(DEFAULT_SOURCES)
  }

  return {
    markup({ content, filename }) {
      const s = new MagicString(content)
      const ast = parse(content, { filename })

      // Import path to import name
      // e.g. ./foo.png => ___ASSET___0
      const imports = new Map<string, string>()

      function addImport(attributeValue: {
        raw: string
        start: number
        end: number
      }) {
        const url = attributeValue.raw.trim()

        if (!http && /^https?:\/\//.test(url)) return

        if (urlFilter && !urlFilter(url)) return

        let importName = ''

        if (imports.has(url)) {
          importName = imports.get(url)
        } else {
          importName = importPrefix + imports.size
          imports.set(url, importName)
        }

        // e.g. <img src="./foo.png" /> => <img src="{___ASSET___0}" />
        s.overwrite(attributeValue.start, attributeValue.end, `{${importName}}`)
      }

      let ignoreNextElement = false

      walk(ast.html, {
        enter(node: any) {
          if (node.type === 'Comment') {
            if (node.data.trim() === IGNORE_FLAG) {
              ignoreNextElement = true
            }
          } else if (node.type === 'Element') {
            if (ignoreNextElement) {
              ignoreNextElement = false
              return
            }

            let lazyAttributes: Record<string, string> | undefined

            function getAttributes() {
              if (!lazyAttributes) {
                lazyAttributes = {}
                node.attributes.forEach((attr: any) => {
                  // Ensure text only, since text only attribute values will only have one element
                  if (attr.value.length > 1 && attr.value[0].type !== 'Text')
                    return
                  lazyAttributes[attr.name] = attr.value[0].raw
                })
              }
              return lazyAttributes
            }

            for (let i = 0; i < sources.length; i++) {
              const source: AssetSource = sources[i]

              // Compare node tag match
              if (source.tag === node.name) {
                function getAttrValue(attr: string) {
                  const attribute = node.attributes.find((v) => v.name === attr)
                  if (!attribute) return

                  // Ensure text only, since text only attribute values will only have one element
                  if (
                    attribute.value.length > 1 &&
                    attribute.value[0].type !== 'Text'
                  )
                    return

                  if (
                    source.filter &&
                    !source.filter({
                      tag: source.tag,
                      attribute: attr,
                      value: content.slice(attribute.start, attribute.end),
                      attributes: getAttributes(),
                    })
                  )
                    return

                  return attribute.value[0]
                }

                // Check src
                source.srcAttributes?.forEach((attr) => {
                  const value = getAttrValue(attr)
                  if (!value) return
                  addImport(value)
                })

                // Check srcset
                source.srcsetAttributes?.forEach((attr) => {
                  const value = getAttrValue(attr)
                  if (!value) return
                  const srcsetRegex = /\s*([^,]\S*).*?(?:,|$)\s*/gm
                  let match: RegExpExecArray
                  while ((match = srcsetRegex.exec(value.raw))) {
                    addImport({
                      raw: match[1],
                      start: value.start + match.index,
                      end: value.start + match.index + match[1].length,
                    })
                  }
                })
              }
            }
          }
        },
      })

      if (imports.size) {
        let importText = ''
        for (const [path, importName] of imports.entries()) {
          importText += `import ${importName} from "${path}";`
        }
        if (ast.module) {
          s.appendLeft(ast.module.content.start, importText)
        } else if (ast.instance) {
          s.appendLeft(ast.instance.content.start, importText)
        } else {
          s.append(`<script>${importText}</script>`)
        }
      }

      return {
        code: s.toString(),
        map: s.generateMap(),
      }
    },
  }
}

const IGNORE_FLAG = 'svelte-preprocess-import-assets-ignore'

const DEFAULT_ASSET_PREFIX = '___ASSET___'

const ALLOWED_REL = [
  'stylesheet',
  'icon',
  'shortcut icon',
  'mask-icon',
  'apple-touch-icon',
  'apple-touch-icon-precomposed',
  'apple-touch-startup-image',
  'manifest',
  'prefetch',
  'preload',
]

const ALLOWED_ITEMPROP = [
  'image',
  'logo',
  'screenshot',
  'thumbnailurl',
  'contenturl',
  'downloadurl',
  'duringmedia',
  'embedurl',
  'installurl',
  'layoutimage',
]

const ALLOWED_META_NAME = [
  'msapplication-tileimage',
  'msapplication-square70x70logo',
  'msapplication-square150x150logo',
  'msapplication-wide310x150logo',
  'msapplication-square310x310logo',
  'msapplication-config',
  'twitter:image',
]

const ALLOWED_META_PROPERTY = [
  'og:image',
  'og:image:url',
  'og:image:secure_url',
  'og:audio',
  'og:audio:secure_url',
  'og:video',
  'og:video:secure_url',
  'vk:image',
]

const DEFAULT_SOURCES: AssetSource[] = [
  {
    tag: 'audio',
    srcAttributes: ['src'],
  },
  {
    tag: 'embed',
    srcAttributes: ['src'],
  },
  {
    tag: 'img',
    srcAttributes: ['src'],
    srcsetAttributes: ['srcset'],
  },
  {
    tag: 'input',
    srcAttributes: ['src'],
  },
  {
    tag: 'object',
    srcAttributes: ['src'],
  },
  {
    tag: 'source',
    srcAttributes: ['src'],
    srcsetAttributes: ['srcset'],
  },
  {
    tag: 'track',
    srcAttributes: ['src'],
  },
  {
    tag: 'video',
    srcAttributes: ['poster'],
  },
  {
    tag: 'image',
    srcAttributes: ['href', 'xlink:href'],
  },
  {
    tag: 'use',
    srcAttributes: ['href', 'xlink:href'],
  },
  {
    tag: 'link',
    srcAttributes: ['href'],
    srcsetAttributes: ['imagesrcset'],
    filter({ attributes }) {
      if (
        attributes.rel &&
        ALLOWED_REL.includes(attributes.rel.trim().toLowerCase())
      ) {
        return true
      }

      if (
        attributes.itemprop &&
        ALLOWED_ITEMPROP.includes(attributes.itemprop.trim().toLowerCase())
      ) {
        return true
      }

      return false
    },
  },
  {
    tag: 'meta',
    srcAttributes: ['content'],
    filter({ attributes }) {
      if (
        attributes.name &&
        ALLOWED_META_NAME.includes(attributes.name.trim().toLowerCase())
      ) {
        return true
      }

      if (
        attributes.property &&
        ALLOWED_META_PROPERTY.includes(attributes.property.trim().toLowerCase())
      ) {
        return true
      }

      if (
        attributes.itemprop &&
        ALLOWED_ITEMPROP.includes(attributes.itemprop.trim().toLowerCase())
      ) {
        return true
      }

      return false
    },
  },
]
