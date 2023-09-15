import * as core from '@actions/core'
import * as github from '@actions/github'
import GitHubRelease from './types/GitHubRelease'
import UpdateManifest from './types/UpdateManifest'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token')
    const addonId = core.getInput('addon-id')

    const client = github.getOctokit(token)

    const releases = await client.request(
      'GET /repos/{owner}/{repo}/releases',
      github.context.repo
    )
    const manifest = generateUpdateManifest(releases.data, addonId)
    core.info(JSON.stringify(manifest))
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
function generateUpdateManifest(
  releases: GitHubRelease[],
  addonId: string
): UpdateManifest {
  core.debug(releases.join(':'))
  core.debug(addonId)
  throw new Error('Function not implemented.')
}
