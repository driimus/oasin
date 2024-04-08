# oasin

[![tests](https://github.com/driimus/oasin/actions/workflows/test.yml/badge.svg)](https://github.com/driimus/oasin/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/oasin.svg?style=flat)](https://www.npmjs.com/package/oasin)

Easily combine APIs from [openapi-generator](https://github.com/OpenAPITools/openapi-generator) client libraries targeting TypeScript.

## Installation

> [!Warning]
> This is an ES only package. Before installing, make sure that your project's configuration supports ECMAScript modules.

```sh
pnpm add oasin
```

## Usage

Use `mixModuleApis` when you need to access to every API client available in the library. Depending on your choice of generator, your imports will have a different structure:

## `typescript-fetch`

```ts
import { mixModuleApis } from 'oasin';

import * as PetStoreAPI from '<your-client-lib>';

export class PetStoreClient extends mixModuleApis(PetStoreAPI, PetStoreAPI.BaseAPI) {
  /** ... */
}
```

For fine-grained control over what is being mixed, you can use `combineMixins` to provide a subset of your client library's APIs:

```ts
import { combineMixins } from 'oasin';

import { PetApi, StoreApi, BaseAPI } from '<your-client-lib>';

export class PetStoreClient extends combineMixins([PetApi, StoreApi], BaseAPI) {}
```

## `typescript-axios`

When clients are generated using `typescript-axios`, top-level exports don't include the `BaseAPI` class. It has to be imported separately:

```ts
import { mixModuleApis } from 'oasin';

import { BaseAPI } from '<your-client-lib>/base';
import * as PetStoreAPI from '<your-client-lib>';

export class PetStoreClient extends mixModuleApis(PetStoreAPI, BaseAPI) {
  /** ... */
}
```

## Limitations

- Overwriting duplicate methods

  When combining a list of API classes, later sources' methods overwrite earlier ones if they have the same key.

  Issues caused by this can be mitigated by enforcing uniqueness operation IDs in the OAS, as codegen derives method names from those.

- Singular configuration

  The returned class will only support one configuration.
  API clients should only be grouped together as long as they rely on the same configuration (base URL, signing requests etc.).

  If you need multiple configurations, consider building a facade for all the separately configured clients.

- Static imports have to be used

  Autoloading a library as a single client won't be supported in the near future, as TypeScript lacks support for infering dynamic import types when the import path is a parameter, even if typed as a string literal.
