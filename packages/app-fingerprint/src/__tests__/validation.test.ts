import { describe, it, expect } from 'vitest';
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
});
