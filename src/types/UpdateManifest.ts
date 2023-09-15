export interface UpdateManifest {
  addons: Addons
}

export interface Addons {
  [key: string]: Addon
}

export interface Addon {
  updates: Update[]
}

export interface Update {
  version: string
  update_link: string
  update_hash?: string
  applications?: Applications
}

export interface Applications {
  [key: string]: BrowserCompatibilityInfo
}

export interface BrowserCompatibilityInfo {
  strict_min_version: string
}
