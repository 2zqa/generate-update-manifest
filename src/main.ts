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
    const client = github.getOctokit(token)

    const releases = await client.request(
      'GET /repos/{owner}/{repo}/releases',
      github.context.repo
    )
    const manifest = generateUpdateManifest(releases.data, addonId)
    return fs.writeFile('manifest.json', JSON.stringify(manifest, null, 2))
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
