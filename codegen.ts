
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/api/graphql",
  // documents: "app/api/graphql/*.ts",
  generates: {
    "app/api/graphql/generated/": {
      preset: "client",
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo", "typescript-resolvers"]
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    }
  }
};

export default config;
