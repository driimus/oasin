# oasin

[![tests](https://github.com/driimus/oasin/actions/workflows/test.yml/badge.svg)](https://github.com/driimus/oasin/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/oasin.svg?style=flat)](https://www.npmjs.com/package/oasin)

Easy type-aware mixing of APIs from TypeScript client libraries generated by [openapi-generator](https://github.com/OpenAPITools/openapi-generator).

## Installation

```sh
pnpm add oasin
```

## Usage

Use `mixModuleApis` when you need to access to every API client available in the library.
Actual syntax will differ based on the generator being used, as each one structures exports differently. Examples:

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

### Overwriting duplicate methods

When combining a list of API classes, later sources' methods overwrite earlier ones if they have the same key.

Normally, this is not an issue - just follow the [spec](https://spec.openapis.org/oas/v3.0.3.html#fixed-fields-7) by enforcing unique operation IDs:

> Unique string used to identify the operation. The id MUST be unique among all operations described in the API.
> The operationId value is case-sensitive.
> Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.

### Singular configuration

The returned class will only support one configuration.
Only API clients with an identical configuration (base URL, signing requests etc.) should be combined.

For multiple configurations, consider building a facade which exposes an entire group of independent client instances.

### Static imports have to be used

Autoloading a library as a single client won't be supported in the near future.
TypeScript currently lacks support for inferring dynamic import types when the import path is a parameter, even if it is typed as a string literal.
