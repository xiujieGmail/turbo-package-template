export interface SDKConfig {
    apiKey?: string;
    environment?: 'production' | 'development';
    storeKey?: string;
    storeType?: 'localStorage' | 'sessionStorage';
}
