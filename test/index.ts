import fs from 'fs/promises'
import path from 'path'
import { test } from 'uvu'
import assert from 'uvu/assert'
import { preprocess } from 'svelte/compiler'
import importAssets from '../src'

const p = (...rest: string[]) => path.resolve(__dirname, ...rest)

test('Snapshot test', async () => {
  const input = await fs.readFile(p('./Input.svelte'), { encoding: 'utf-8' })
  const processed = await preprocess(input, [
    importAssets({
      urlFilter: (v) => !/\.(abc|exe)$/.test(v),
    }),
  ])

  if (process.argv.slice(2).includes('-u')) {
    await fs.writeFile(p('./Output.svelte'), processed.code)
  } else {
    const output = await fs.readFile(p('./Output.svelte'), {
      encoding: 'utf-8',
    })
    assert.fixture(
      processed.code,
      output,
      '`Output.svelte` does not match, is it updated with `pnpm test:update`?'
    )
  }
})

test.run()
