import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, it } from 'vitest'
import { preprocess } from 'svelte/compiler'
import { importAssets } from '../src/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const resolve = /** @param {string} file */ (file) =>
  path.resolve(__dirname, file)

it('Snapshot test', async () => {
  const filename = 'Input.svelte'
  const input = await fs.readFile(resolve(filename), { encoding: 'utf-8' })
  const processed = await preprocess(
    input,
    [
      importAssets({
        urlFilter: (v) => !/\.(abc|exe)$/.test(v),
        sources(defaultSources) {
          return [
            ...defaultSources,
            {
              tag: 'Image',
              srcAttributes: ['src'],
            },
            {
              tag: 'img',
              srcAttributes: ['src'],
              filter() {
                // dummy source, make sure no errors only
                return false
              },
            },
          ]
        },
      }),
    ],
    { filename }
  )

  // Make imports readable
  const outputCode = processed.code.replace(/import/g, `\nimport`)

  expect(outputCode).toMatchFileSnapshot('./Output.svelte')
})
