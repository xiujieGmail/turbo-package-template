import { SDKConfig } from '../types/config';

export const DEFAULT_CONFIG: Partial<SDKConfig> = {
    environment: 'development',
    storeKey: 'APP_FINGERPRINT_KEY',
    storeType: 'localStorage',
};

export const VERSION = '0.1.0';
