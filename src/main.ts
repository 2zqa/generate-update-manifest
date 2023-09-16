import * as core from '@actions/core'
import * as github from '@actions/github'
import GitHubRelease from './types/GitHubRelease'
import UpdateManifest, { Update } from './types/UpdateManifest'
import * as fs from 'node:fs/promises'

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
