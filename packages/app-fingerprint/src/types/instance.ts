import { SDKConfig } from './config';

export interface SDKInstance {
    initialize(config: SDKConfig): void;
    version: string;
}
