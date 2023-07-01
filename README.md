# uncsrf

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![License][license-src]][license-href]

This library provides a single api to create and verify [csrf token](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html). It use [web-crypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) for non Node.js target and [node:crypto](https://nodejs.org/api/crypto.html#crypto) using [Conditional Exports](https://nodejs.org/api/packages.html#conditional-exports).

**Requirements:**

- **Node.js**
- **Browser**: [Secure Context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) (HTTPS/Localhost) in [Supported Browsers](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto#browser_compatibility)
- **Other Runtimes:** Exposed `globalThis.crypto` and `globalThis.crypto.subtle`. (you can polyfill if needed)

## Usage

Install package:

```sh
# npm
npm install uncsrf

# yarn
yarn add uncsrf

# pnpm
pnpm install uncsrf
```

Import:

```js
// ESM
import { importEncryptSecret, create, verify } from 'uncsrf'

// CommonJS
const { importEncryptSecret, create, verify } = require('uncsrf')
```

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with 💛, inspired by [uncrypto](https://github.com/unjs/uncrypto).

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/uncsrf?style=flat-square
[npm-version-href]: https://npmjs.com/package/uncsrf
[npm-downloads-src]: https://img.shields.io/npm/dt/uncsrf.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/uncsrf
[github-actions-ci-src]: https://img.shields.io/github/actions/workflow/status/morgbn/uncsrf/ci.yml?style=flat-square
[github-actions-ci-href]: https://github.com/morgbn/uncsrf/actions
[license-src]: https://img.shields.io/npm/l/uncsrf.svg?style=flat-square
[license-href]: https://npmjs.com/package/uncsrf