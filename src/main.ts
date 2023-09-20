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
    const addonId = core.getInput('addon-id')
    const outputFile = core.getInput('output-file')
    const client = github.getOctokit(token)

    // Validate inputs
    const validator = new Validator()
    await validateInputs(validator, token, addonId, outputFile)

    if (!validator.isValid()) {
      throw new Error(validator.toJSON())
    }

    core.info(`Fetching releases...`)
    const releases = await client.request(
      'GET /repos/{owner}/{repo}/releases',
      github.context.repo
    )

    core.info(`Generating manifest...`)
    const manifest = generateUpdateManifest(releases.data, addonId)
    const manifestString = JSON.stringify(manifest, null, 2)

    core.debug(`Writing manifest: ${manifestString} to ${outputFile}`)
    await fs.writeFile(outputFile, manifestString)
    core.setOutput('manifest', outputFile)
    core.info(`Successfully generated and written manifest`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

/**
 * Validates the action inputs.
 *
 * @param validator - The validator object to use for checking inputs.
 * @param token - The GitHub token to use for authentication.
 * @param addonId - The ID of the addon to generate the manifest for.
 * @param outputFile - The path to the output file to write the manifest to.
 * @returns A Promise that resolves when the inputs have been validated.
 */
export async function validateInputs(
  validator: Validator,
  token: string,
  addonId: string,
  outputFile: string
): Promise<void> {
  validator.check(!!addonId, 'addon-id', 'The addon ID is required')
  validator.check(!!outputFile, 'output-file', 'The output file is required')
  validator.check(!!token, 'github-token', 'The GitHub token is required')

  // Check whether the addon ID is either a valid e-mail or a valid UUID
  const isValidEmail = addonId.match(Validator.emailRegex) !== null
  const isValidUuid = addonId.match(Validator.uuidRegex) !== null
  validator.check(
    isValidEmail || isValidUuid,
    'addon-id',
    `The addon ID is neither a valid e-mail nor a valid UUID`
  )

  // Check whether the output file is writable
  return fs.access(outputFile, fs.constants.W_OK).catch(() => {
    validator.addError('output-file', `The output file is not writable`)
  })
}

export function generateUpdateManifest(
  releases: GitHubRelease[],
  addonId: string
): UpdateManifest {
  const mappedUpdates: Update[] = releases.map(release => ({
    version: release.tag_name,
    update_link: release.assets[0]?.browser_download_url
  }))

  return {
    addons: {
      [addonId]: {
        updates: mappedUpdates
      }
    }
  }
}
