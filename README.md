# pplingo Workspace

A monorepo for SDK development using pnpm workspaces.

## Getting Started

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development
pnpm dev
```

## Creating a New SDK

```bash
pnpm create-sdk <sdk-name>
```

## Publishing Packages

1. Create a changeset (documents changes for the next release):

```bash
pnpm changeset
```

2. Review and commit the generated changeset files

3. Publish packages:

```bash
pnpm publish-packages
```

## Project Structure

```
.
├── packages/           # SDK packages
│   └── core/          # Core SDK package
├── scripts/           # Build and utility scripts
└── plugins/           # Custom plugins
```

## Commands

- `pnpm build`: Build all packages
- `pnpm dev`: Start development mode
- `pnpm test`: Run tests
- `pnpm lint`: Lint all packages
- `pnpm format`: Format code using Prettier
- `pnpm publish-packages`: Publish packages to npm
- `pnpm create-sdk`: Create a new SDK package
