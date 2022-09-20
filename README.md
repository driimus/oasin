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

- subsequent APIs will overwrite method signatures of previoussources. You can prevent this by ensuring that there are no duplicate operation IDs in the OAS
- the returned class will only support one configuration. API clients should only be grouped together as long as they rely on the same configuration (base URL, signing requests etc.).
- static imports have to be used. Autoloading a library as a single client won't be supported in the near future, as TypeScript lacks support for infering dynamic import types when the import path is a parameter, even if typed as a string literal.
