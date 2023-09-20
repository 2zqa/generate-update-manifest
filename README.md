# Generate Update Manifest Action

[![GitHub Super-Linter](https://github.com/2zqa/generate-update-manifest/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
[![Continuous Integration](https://github.com/2zqa/generate-update-manifest/actions/workflows/ci.yml/badge.svg)](https://github.com/2zqa/generate-update-manifest/actions/workflows/ci.yml)
![Code Coverage](./badges/coverage.svg)

This action generates an update manifest file for self distributed Firefox
addons. Recommended to be used with GitHub Pages or any other static file
hoster.

## Inputs

### `addon-id`

**Required** The
[ID of the addon](https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/).
Can be found under the technical details section in the extension overview on
https://addons.mozilla.org. For example:
`{f05c7275-f183-4f0a-87ed-e3e61fc9ae0a}` or `uBlock0@raymondhill.net`

### `output-file`

The path to the generated update manifest file. Defaults to
`./update_manifest.json`

### `github-token`

GitHub token to retrieve releases with. Defaults to `${{ github.token }}`

## Outputs

### `manifest`

The relative path to the generated update manifest file.

## Example usage

```yaml
uses: 2zqa/generate-update-manifest@v1
with:
  addon-id: ${{ env.ADDON_ID }}
```

## Acknowledgements

This action would not be possible without the following resources:

- https://github.com/actions/typescript-action - Template this action is based
  on
- https://extensionworkshop.com/documentation/manage/updating-your-extension/#manifest-structure -
  Update manifest documentation
