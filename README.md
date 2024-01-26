# Generate Update Manifest Action

[![Lint Codebase](https://github.com/2zqa/generate-update-manifest/actions/workflows/linter.yml/badge.svg)](https://github.com/2zqa/generate-update-manifest/actions/workflows/ci.yml)
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

**Note:** Make sure that you match only one asset with the `asset-filter` input.
Otherwise the action will pick the first asset that matches the filter.

```yaml
uses: 2zqa/generate-update-manifest@v1
with:
  addon-id: ${{ env.ADDON_ID }}
  asset-filter: '*.xpi'
```

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

This project welcomes contributions and suggestions. Please open an issue or
create a pull request to contribute.

This project follows the [Action Versioning](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) workflow.

## Further reading

- How to enable and test updates for your extension:
  https://extensionworkshop.com/documentation/manage/updating-your-extension/
- Example addon that uses this action:
  https://github.com/2zqa/startpagina-private
