import { SDKConfig } from '../types/config';

export function validateConfig(config: SDKConfig): void {
    if (!config.apiKey) {
        throw new Error('API key is required');
    }

    if (
        config.environment &&
        !['production', 'development'].includes(config.environment)
    ) {
        throw new Error(
            'Environment must be either "production" or "development"'
        );
    }
}
