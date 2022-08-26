# oasin

Easily combine APIs from openapi-generated client libraries with TypeScript support.

# Installation

```sh
pnpm add oasin
```

# Usage

Use `autoMix` when you need to access to every API client available in the library:

```ts
import { autoMix } from 'oasin';

import { BaseAPI } from '<your-client-lib>/base';
import * as PetStoreAPI from '<your-client-lib>';

export class PetStoreClient extends autoMix(PetStoreAPI, BaseAPI) {
  /** ... */
}
```

For fine-grained control over what is being mixed, you can use `mixApis` to provide a subset of your client library's APIs:

```ts
import { autoMix } from 'oasin';

import { BaseAPI } from '<your-client-lib>/base';
import { PetApi, StoreApi } from '<your-client-lib>';

export class PetStoreClient extends mixApis([PetApi, StoreApi], BaseAPI) {}
```

## Limitations

- TODO: explain lack of runtime safety in the event of duplicate operation IDs
- TODO: explain lack of support for full autoloading due to missing import type inference via string literal
