import { parse, walk } from 'svelte/compiler'
import { PreprocessorGroup } from 'svelte/types/compiler/preprocess'
import MagicString from 'magic-string'

export interface ImportAssetsOptions {
  sources?: AssetSource[] | ((defaultSources: AssetSource[]) => AssetSource[])
  importPrefix?: string
  urlFilter?: (url: string) => boolean
}

export interface AssetSource {
  tag: string
  srcAttrs?: string[]
  srcsetAttrs?: string[]
}

export default function importAssets(
  options: ImportAssetsOptions = {}
): PreprocessorGroup {
  let {
    sources = DEFAULT_SOURCES,
    importPrefix = DEFAULT_ASSET_PREFIX,
    urlFilter = () => true,
  } = options

  if (typeof sources === 'function') {
    sources = sources(DEFAULT_SOURCES)
  }

  return {
    markup({ content, filename }) {
      const s = new MagicString(content)
      const ast = parse(content, { filename })

      // Import path to import name
      // e.g. ./foo.png => __ASSET__0
      const imports = new Map<string, string>()

      function addImport(attributeValue: {
        raw: string
        start: number
        end: number
      }) {
        const url = attributeValue.raw

        if (!urlFilter(url)) return

        let importName = ''

        if (imports.has(url)) {
          importName = imports.get(url)
        } else {
          importName = importPrefix + imports.size
          imports.set(url, importName)
        }

        s.overwrite(attributeValue.start, attributeValue.end, `{${importName}}`)
      }

      let ignoreNextElement = false

      walk(ast.html, {
        enter(node) {
          if (node.type === 'Comment') {
            if (node.data.trim() === IGNORE_FLAG) {
              ignoreNextElement = true
            }
          } else if (node.type === 'Element') {
            if (ignoreNextElement) {
              ignoreNextElement = false
              return
            }

            for (let i = 0; i < sources.length; i++) {
              const source = sources[i]

              // Compare node tag match
              if (source.tag === node.name) {
                // Check src
                source.srcAttrs?.forEach((attr) => {
                  const attribute = node.attributes.find((v) => v.name === attr)
                  if (attribute) {
                    const v = attribute.value[0]
                    if (v.type === 'Text') {
                      addImport(v)
                    }
                  }
                })

                // Check srcset
                source.srcsetAttrs?.forEach((attr) => {
                  const attribute = node.attributes.find((v) => v.name === attr)
                  if (attribute) {
                    const v = attribute.value[0]
                    if (v.type === 'Text') {
                      const srcsetRegex = /\s*([^,]\S*).*?(?:,|$)\s*/gm
                      let match: RegExpExecArray
                      while ((match = srcsetRegex.exec(v.raw))) {
                        addImport({
                          raw: match[1],
                          start: v.start + match.index,
                          end: v.start + match.index + match[1].length,
                        })
                      }
                    }
                  }
                })

                break
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
          s.appendLeft(ast.module.content.start, importText)
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

const DEFAULT_ASSET_PREFIX = '__ASSET__'

const DEFAULT_SOURCES: AssetSource[] = [
  {
    tag: 'audio',
    srcAttrs: ['src'],
  },
  {
    tag: 'embed',
    srcAttrs: ['src'],
  },
  {
    tag: 'img',
    srcAttrs: ['src'],
    srcsetAttrs: ['srcset'],
  },
  {
    tag: 'input',
    srcAttrs: ['src'],
  },
  {
    tag: 'object',
    srcAttrs: ['src'],
  },
  {
    tag: 'source',
    srcAttrs: ['src'],
    srcsetAttrs: ['srcset'],
  },
  {
    tag: 'track',
    srcAttrs: ['src'],
  },
  {
    tag: 'video',
    srcAttrs: ['poster'],
  },
  {
    tag: 'image',
    srcAttrs: ['href', 'xlink:href'],
  },
  {
    tag: 'use',
    srcAttrs: ['href', 'xlink:href'],
  },
  {
    tag: 'link',
    srcAttrs: ['href'],
    srcsetAttrs: ['imagesrcset'],
  },
]
