import { describe, it, expect } from 'vitest';
import { SDK } from '../lib/main';
import { VERSION } from '../config/defaults';

describe('SDK', () => {
    it('should initialize with config', () => {
        const sdk = new SDK();
        const config = { apiKey: 'test-key' };

        sdk.initialize(config);
        expect(sdk.version).toBe(VERSION);
        expect(sdk.getConfig()).toEqual({
            apiKey: 'test-key',
            environment: 'development',
            storeKey: 'APP_FINGERPRINT_KEY',
            storeType: 'localStorage',
        });
    });

    it('should override default config', () => {
        const sdk = new SDK();
        const config = {
            apiKey: 'test-key',
            environment: 'production' as const,
            storeKey: 'CUSTOM_KEY',
            storeType: 'localStorage' as const,
        };

        sdk.initialize(config);
        expect(sdk.getConfig()).toEqual(config);
    });

    it('get user id 32', () => {
        const sdk = new SDK();
        const id = sdk.get32UUID();
        expect(typeof id).toBe('string');
        expect(id.length).toBe(32);
    });

    it('get user id 16', () => {
        const sdk = new SDK();
        const id = sdk.get16UUID();
        expect(typeof id).toBe('string');
        expect(id.length).toBe(16);
    });

    it('get user id', async () => {
        const sdk = new SDK();
        const id = await sdk.getUserId();
        expect(typeof id).toBe('string');
        expect(id.length).toBe(32);
    });
    it('Test if UserId is equal', async () => {
        const sdk = new SDK();

        const id1 = await sdk.getUserId();
        const id2 = await sdk.getUserId();
        expect(id1).toBe(id2);
    });
});
