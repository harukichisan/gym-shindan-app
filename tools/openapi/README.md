# OpenAPI Tooling

## Type generation (TypeScript)
Uses openapi-typescript to generate types from docs/openapi.yaml.

Command:
- npx openapi-typescript --config tools/openapi/openapi-typescript.config.mjs

Output:
- src/generated/api-types.ts

## Mock server
Uses Prism to mock the API from the OpenAPI spec.

Command:
- npx @stoplight/prism-cli mock docs/openapi.yaml -p 4010 --cors

Notes:
- Run from repo root.
- Port can be changed as needed.
