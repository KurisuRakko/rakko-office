# NOTICE

Rakko Office is a fork of [baotlake/office-website](https://github.com/baotlake/office-website),
rebranded and adapted for self-hosted Docker deployment. Rakko Office's own source code is
licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)** — see [LICENSE.txt](./LICENSE.txt)
for the full license text.

This project incorporates work from the following third parties:

## baotlake/office-website

Copyright © baotlake and contributors.
Licensed under AGPL-3.0.
<https://github.com/baotlake/office-website>

The original upstream project this repository was forked from.

## ONLYOFFICE (Ascensio System SIA)

Copyright © Ascensio System SIA.
Licensed under AGPL-3.0.

- DocumentServer — <https://github.com/ONLYOFFICE/DocumentServer>
- sdkjs — <https://github.com/ONLYOFFICE/sdkjs>
- web-apps — <https://github.com/ONLYOFFICE/web-apps>

This project runs the ONLYOFFICE DocumentServer editing engine (`sdkjs` / `web-apps` /
fonts) as static runtime assets, pulled from the official `onlyoffice/documentserver`
Docker image at build time (see `scripts/fetch-assets.sh` and `Dockerfile`); they are not
checked into this repository.

## CryptPad contributors

<https://github.com/cryptpad/onlyoffice-x2t-wasm>

Used for the in-browser x2t WebAssembly document conversion artifacts
(`public/x2t/`, `public/x2t-1/`). This upstream repository does not carry an explicit
license declaration at the time of writing — refer to the repository itself for current
terms.

## @ziziyi/utils

Copyright © baotlake.
MIT License (per this project's own prior integration notes; not independently
re-verified against the upstream package).
<https://github.com/baotlake/ziziyi>

The i18n locale type/constant definitions actually used by this project were inlined
into `lib/locale.ts` to remove the runtime dependency on this individually-maintained
npm package. The inlined code is behaviorally identical to the original.
