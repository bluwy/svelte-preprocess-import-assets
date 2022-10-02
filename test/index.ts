import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { preprocess } from 'svelte/compiler'
import importAssets from '../src/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const p = (...rest: string[]) => path.resolve(__dirname, ...rest)

test('Snapshot test', async () => {
  const input = await fs.readFile(p('./Input.svelte'), { encoding: 'utf-8' })
  const processed = await preprocess(
    input,
    [
      importAssets({
        urlFilter: (v) => !/\.(abc|exe)$/.test(v),
      }),
    ],
    { filename: 'Input.svelte' }
  )

  // Make imports readable
  const outputCode = processed.code.replace(/import/g, `\nimport`)

  if (process.argv.slice(2).includes('-u')) {
    await fs.writeFile(p('./Output.svelte'), outputCode)
  } else {
    const output = await fs.readFile(p('./Output.svelte'), {
      encoding: 'utf-8',
    })
    assert.fixture(
      outputCode,
      output,
      '`Output.svelte` does not match, is it updated with `pnpm test:update`?'
    )
  }
})

test.run()
