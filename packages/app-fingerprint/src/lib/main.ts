import { SDKConfig, SDKInstance } from '../types';
import { DEFAULT_CONFIG, VERSION } from '../config/defaults';
import { getFingerprintId, getUUID } from '../utils/fingerprintId';

export class SDK implements SDKInstance {
    private config?: SDKConfig;
    public readonly version = VERSION;

    initialize(config: SDKConfig): void {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    getConfig(): SDKConfig | undefined {
        return this.config;
    }

    async createUserId(): Promise<string> {
        try {
            const fingerprintId = await getFingerprintId();
            const uuid = getUUID();
            const resultUUid = fingerprintId + uuid;
            this.setStore(resultUUid);
            return resultUUid;
        } catch (e: Error | any) {
            throw new Error(e.message);
        }
    }
    async getUserId() {
        return await this.getStore();
    }

    setStore(id: string): null | void {
        if (!id) return null;
        const storeType = this.config?.storeType ?? 'localStorage';
        const storeKey = this.config?.storeKey ?? 'APP_FINGERPRINT_KEY';
        global[storeType].setItem(storeKey, id);
    }

    async getStore() {
        const storeType = this.config?.storeType ?? 'localStorage';
        const storeKey = this.config?.storeKey ?? 'APP_FINGERPRINT_KEY';
        const id = global[storeType].getItem(storeKey);
        if (!id) {
            return await this.createUserId();
        }
        return id;
    }

    get16UUID() {
        return getUUID(16);
    }

    get32UUID(): string {
        return getUUID(32);
    }
}

const sdk = new SDK();

function get32UUID() {
    return sdk.get32UUID();
}

function get16UUID() {
    return sdk.get16UUID();
}

function getUserId() {
    return Promise.resolve(sdk.getUserId());
}

export { get32UUID, get16UUID, getUserId };
