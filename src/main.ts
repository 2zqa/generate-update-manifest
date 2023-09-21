import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fs from 'node:fs/promises'
import GitHubRelease from './types/GitHubRelease'
import UpdateManifest, { Update } from './types/UpdateManifest'
import Validator from './validator'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token')
    const addonID = core.getInput('addon-id')
    const outputFile = core.getInput('output-file')
    const repository = core.getInput('repository')
    const assetFilter = core.getInput('asset-filter')
    const client = github.getOctokit(token)

    // Validate inputs
    const validator = new Validator()
    validator.check(!!addonID, 'addon-id', 'The addon ID is required')
    validator.check(!!outputFile, 'output-file', 'The output file is required')
    validator.check(!!token, 'github-token', 'The GitHub token is required')
    validator.check(!!token, 'repository', 'The repository is required')
    validateRepository(validator, repository)
    validateAddonID(validator, addonID)
    if (!validator.isValid()) {
      throw new Error(validator.toJSON())
    }

    core.info(`Fetching releases...`)
    const [owner, repo] = repository.split('/')
    const releases = await client.request(
      'GET /repos/{owner}/{repo}/releases',
      { owner, repo }
    )

    core.info(`Generating manifest...`)
    const manifest = generateUpdateManifest(releases.data, addonID, assetFilter)
    const manifestString = JSON.stringify(manifest, null, 2)

    core.debug(`Writing manifest: ${manifestString} to ${outputFile}`)
    try {
      await fs.writeFile(outputFile, manifestString)
    } catch (err) {
      validator.addError('output-file', `${outputFile} is not writable: ${err}`)
      core.setFailed(validator.toJSON())
    }

    core.setOutput('manifest', outputFile)
    core.info(`Successfully generated and written manifest`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export function validateAddonID(validator: Validator, addonId: string): void {
  const isValidEmail = addonId.match(Validator.emailRegex) !== null
  const isValidUuid = addonId.match(Validator.uuidRegex) !== null
  validator.check(
    isValidEmail || isValidUuid,
    'addon-id',
    `The addon ID is neither a valid e-mail nor a valid UUID`
  )
}

export function validateRepository(
  validator: Validator,
  repository: string
): void {
  validator.check(
    repository.split('/').length === 2,
    'repository',
    `The repository must be in the format owner/repo`
  )
}

export function generateUpdateManifest(
  releases: GitHubRelease[],
  addonId: string,
  assetFilter: string
): UpdateManifest {
  const updates: Update[] = []
  for (const release of releases) {
    let assets = release.assets
    if (assetFilter) {
      assets = assets.filter(asset => asset.name.match(assetFilter) !== null)
    }

    // Check if there are any assets left after filtering
    if (assets.length === 0) {
      let warningText = `No assets found for release ${release.tag_name}.`
      if (assetFilter) {
        warningText.concat(` Filter used: ${assetFilter}`)
      }
      core.warning(warningText)
      break
    }

    if (assets.length > 1) {
      core.warning(
        `Found ${assets.length} for release ${release.tag_name}. Using the first asset.`
      )
    }

    updates.push({
      version: release.tag_name,
      update_link: assets[0].browser_download_url
    })
  }

  return {
    addons: {
      [addonId]: {
        updates
      }
    }
  }
}
