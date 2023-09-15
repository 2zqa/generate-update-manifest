/**
 * An object describing the update manifest.
 *
 * @see {@link https://extensionworkshop.com/documentation/manage/updating-your-extension/#manifest-structure}
 */
export default interface UpdateManifest {
  /** An object containing one entry for each add-on to be updated. For each such entry, the name of the property must be the add-on's UUID, and the value must be an object describing the add-on and its updates. */
  addons: Addons
}

export interface Addons {
  [key: string]: Addon
}

export interface Addon {
  /** An array containing zero or more update description objects for the add-on. */
  updates?: Update[]
}

/**
 * Update description objects must be object literals.
 */
export interface Update {
  /** The version number this update entry describes. If an update URL is specified, it must use this version. If any compatibility information is specified, it will override the compatibility information of any installed version with this version number. */
  version: string
  /** A link to the XPI file containing this version of the add-on. This must be an HTTPS URL, or an update_hash must be provided to verify it. */
  update_link?: string
  /** A cryptographic hash of the file pointed to by update_link. This must be provided if update_link is not a secure URL. If present, this must be a string beginning with either sha256: or sha512:, followed by the hexadecimal-encoded hash of the matching type. */
  update_hash?: string
  /** A link to an HTML file containing information about the update. */
  update_info_url?: string
  /** An object containing browser-specific compatibility information. Each property must contain a {@link Applications} object. The only browser supported is gecko, which includes Firefox and all other browsers built on the same runtime. If this property is omitted, support for Gecko is assumed. Otherwise, if this property is defined, it must contain a gecko property, or the update entry is ignored. */
  applications?: Applications
}

/**
 * applications objects specify compatibility information for a specific browser. They must be object literals.
 */
export interface Applications {
  [key: string]: BrowserCompatibilityInfo
}

export interface BrowserCompatibilityInfo {
  /** The minimum version of the browser this add-on will run on. */
  strict_min_version?: string
  /** The maximum version of the browser this add-on will run on. */
  strict_max_version?: string
  /** The maximum version of the browser this add-on is likely to run on. This property is ignored in most cases. */
  advisory_max_version?: string
}
