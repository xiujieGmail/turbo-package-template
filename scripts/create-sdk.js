#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Get SDK name from command line arguments
const sdkName = process.argv[2];

if (!sdkName) {
    console.error('Please provide an SDK name as an argument');
    console.log('Usage: pnpm create-sdk <sdk-name>');
    process.exit(1);
}

const sdkPath = path.join('packages', sdkName);

// Create directory structure
const directories = [
    'src',
    'src/__tests__',
    'src/core',
    'src/types',
    'src/config',
    'src/utils',
].map((dir) => path.join(sdkPath, dir));

directories.forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
});

// Create package.json
const packageJson = {
    name: `@pplingo/${sdkName}`,
    version: '0.1.0',
    main: './dist/index.js',
    module: './dist/index.mjs',
    types: './dist/index.d.ts',
    sideEffects: false,
    license: 'MIT',
    files: ['dist/**'],
    scripts: {
        build: 'tsup src/index.ts --format esm,cjs --dts --external react',
        dev: 'tsup src/index.ts --format esm,cjs --watch --dts --external react',
        lint: 'eslint "src/**/*.ts*"',
        test: 'vitest run',
        'test:watch': 'vitest',
        clean: 'rm -rf .turbo && rm -rf node_modules && rm -rf dist',
    },
    devDependencies: {
        tsup: '^8.0.2',
        vitest: '^1.3.1',
    },
    publishConfig: {
        access: 'public',
    },
};

fs.writeFileSync(
    path.join(sdkPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
);

// Create source files
const files = {
    'src/index.ts': `export * from './core/main';
export * from './types';
export * from './config/defaults';`,

    'src/types/config.ts': `export interface SDKConfig {
    apiKey: string;
    environment?: 'production' | 'development';
}`,

    'src/types/instance.ts': `import { SDKConfig } from './config';

export interface SDKInstance {
  initialize(config: SDKConfig): void;
  version: string;
}`,

    'src/types/index.ts': `export * from './config';
export * from './instance';`,

    'src/config/defaults.ts': `import { SDKConfig } from '../types/config';

export const DEFAULT_CONFIG: Partial<SDKConfig> = {
  environment: 'development',
};

export const VERSION = '0.1.0';`,

    'src/utils/validation.ts': `import { SDKConfig } from '../types/config';

export function validateConfig(config: SDKConfig): void {
  if (!config.apiKey) {
    throw new Error('API key is required');
  }
  
  if (config.environment && !['production', 'development'].includes(config.environment)) {
    throw new Error('Environment must be either "production" or "development"');
  }
}`,

    'src/core/main.ts': `import { SDKConfig, SDKInstance } from '../types';
import { DEFAULT_CONFIG, VERSION } from '../config/defaults';
import { validateConfig } from '../utils/validation';

export class SDK implements SDKInstance {
  private config?: SDKConfig;
  public readonly version = VERSION;

  initialize(config: SDKConfig): void {
    validateConfig(config);
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  getConfig(): SDKConfig | undefined {
    return this.config;
  }
}`,

    'src/__tests__/sdk.test.ts': `import { describe, it, expect } from 'vitest';
import { SDK } from '../core/main';
import { VERSION } from '../config/defaults';

describe('SDK', () => {
  it('should initialize with config', () => {
    const sdk = new SDK();
    const config = { apiKey: 'test-key' };
    
    sdk.initialize(config);
    expect(sdk.version).toBe(VERSION);
    expect(sdk.getConfig()).toEqual({
      apiKey: 'test-key',
      environment: 'development'
    });
  });

  it('should override default config', () => {
    const sdk = new SDK();
    const config = {
      apiKey: 'test-key',
      environment: 'production' as const
    };
    
    sdk.initialize(config);
    expect(sdk.getConfig()).toEqual(config);
  });
});`,

    'src/__tests__/validation.test.ts': `import { describe, it, expect } from 'vitest';
import { validateConfig } from '../utils/validation';

describe('Config Validation', () => {
  it('should throw error when apiKey is missing', () => {
    expect(() => validateConfig({} as any)).toThrow('API key is required');
  });

  it('should throw error for invalid environment', () => {
    expect(() =>
      validateConfig({ apiKey: 'test', environment: 'invalid' as any })
    ).toThrow('Environment must be either "production" or "development"');
  });

  it('should not throw for valid config', () => {
    expect(() =>
      validateConfig({ apiKey: 'test', environment: 'production' })
    ).not.toThrow();
  });
});`,

    'vitest.config.ts': `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/']
    }
  }
});`,
};

// Write all files
Object.entries(files).forEach(([filePath, content]) => {
    fs.writeFileSync(path.join(sdkPath, filePath), content);
});

// Install dependencies
execSync('pnpm install', { stdio: 'inherit' });

console.log(`\n✨ SDK "${sdkName}" created successfully!`);
console.log('\nYou can now:');
console.log(`  1. cd packages/${sdkName}`);
console.log('  2. Run tests: pnpm test');
console.log('  3. Watch tests: pnpm test:watch');
console.log('  4. Build the SDK: pnpm build');
