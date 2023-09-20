/**
 * Unit tests for the action's main business logic, src/main.ts
 */
import * as main from '../src/main'
import * as fs from 'node:fs/promises'
import Validator from '../src/validator'

const addonIDRegex = '{692884b1-e357-4adb-9e3c-f4a3d74bb38b}'

describe('generateUpdateManifest', () => {
  it('returns a manifest with an empty updates list', () => {
    expect(main.generateUpdateManifest([], addonIDRegex)).toEqual({
      addons: {
        [addonIDRegex]: {
          updates: []
        }
      }
    })
  })

  it('generates a manifest', async () => {
    const expectedJsonPromise = fs.readFile(
      './__tests__/fixtures/expected.json'
    )
    const mockedResponsePromise = fs.readFile(
      './__tests__/fixtures/releases.json'
    )
    const [expectedJson, mockedResponse] = await Promise.all([
      expectedJsonPromise,
      mockedResponsePromise
    ])
    const expected = JSON.parse(expectedJson.toString())
    const releases = JSON.parse(mockedResponse.toString())

    const manifest = main.generateUpdateManifest(releases, addonIDRegex)

    expect(manifest).toEqual(expected)
  })
})
