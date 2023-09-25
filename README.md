# Generate Update Manifest Action

[![GitHub Super-Linter](https://github.com/2zqa/generate-update-manifest/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
[![Continuous Integration](https://github.com/2zqa/generate-update-manifest/actions/workflows/ci.yml/badge.svg)](https://github.com/2zqa/generate-update-manifest/actions/workflows/ci.yml)
![Code Coverage](./badges/coverage.svg)

This action generates an update manifest file for self distributed Firefox
addons based on the releases. Recommended to be used with GitHub Pages or any
other static file hoster.

**Note:** This action only works on public repositories, as releases on private
repositories are not publicly accessible.

## Inputs

### `addon-id`

**Required** The
[ID of the addon](https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/).
Can be found under the technical details section in the extension overview on
https://addons.mozilla.org. For example:
`{f05c7275-f183-4f0a-87ed-e3e61fc9ae0a}` or `uBlock0@raymondhill.net`.

### `output-file`

The path to the generated update manifest file. Defaults to `./updates.json`.

### `github-token`

GitHub token to retrieve releases with. Defaults to `${{ github.token }}`.

### `repository`

The repository to retrieve releases from. Defaults to
`${{ github.repository }}`. For example: `2zqa/startpagina`.

### `asset-filter`

A glob pattern to filter the assets by. For example: `*.xpi`.

## Outputs

### `manifest`

The path to the generated update manifest file. Equal to the input
`output-file`.

## Example usage

```yaml
uses: 2zqa/generate-update-manifest@v1
with:
  addon-id: ${{ env.ADDON_ID }}
```

## License

This project is licensed under the [MIT License](LICENSE).

## Further reading

- How to enable and test updates for your extension:
  https://extensionworkshop.com/documentation/manage/updating-your-extension/
- Example GitHub template repository that uses this action:
  https://github.com/2zqa/startpagina
