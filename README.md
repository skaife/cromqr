# CromQR

A personal QR code library and generator for Nextcloud.

## Features

- Generate QR codes from 7 data types: URL, plain text, vCard, Wi-Fi, Email, SMS, and Geo coordinates
- Live preview with custom foreground and background color pickers
- Personal library with list and grid views
- Save, rename, edit, and delete library entries
- Download as SVG or PNG
- Export directly to your Nextcloud Files
- Per-user isolation — each Nextcloud user has their own private library
- Fully client-side QR generation — no external services or tracking

## Installation

Install via the [Nextcloud App Store](https://apps.nextcloud.com) or manually:

1. Download the latest release
2. Extract to your Nextcloud `apps/` directory as `cromqr/`
3. Enable via Apps admin panel or: `php occ app:enable cromqr`

## Development

Requirements: Node.js, npm, PHP, a running Nextcloud instance.

```bash
npm install
npm run build       # production build
npm run watch       # development watch mode
```

## License

AGPL-3.0 — see [COPYING](COPYING)

## Author

Scott Skaife — [crom@skaife.org](mailto:crom@skaife.org)

Part of the **Crom** suite of Nextcloud tools.
