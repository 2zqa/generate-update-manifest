/**
 * Unit tests for the action's main business logic, src/main.ts
 */
import * as main from '../src/main'
import fs from 'fs'

const testUuid = '{692884b1-e357-4adb-9e3c-f4a3d74bb38b}'

describe('generateUpdateManifest', () => {
  it('returns a manifest with an empty updates list', () => {
    expect(main.generateUpdateManifest([], testUuid)).toEqual({
      addons: {
        [testUuid]: {
          updates: []
        }
      }
    })
  })

  it('generates a manifest', () => {
    const expectedJson = fs.readFileSync('./__tests__/fixtures/expected.json')
    const mockedResponse = fs.readFileSync('./__tests__/fixtures/releases.json')
    const expected = JSON.parse(expectedJson.toString())
    const releases = JSON.parse(mockedResponse.toString())

    const manifest = main.generateUpdateManifest(releases, testUuid)

    expect(manifest).toEqual(expected)
  })
})