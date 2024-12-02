import * as Fingerprint2 from 'fingerprintjs2';
import { v4 as uuIdV4 } from 'uuid';
export function getFingerprintId() {
    return new Promise((resolve, reject) => {
        let murmur = null;
        try {
            Fingerprint2.get(function (components) {
                const values = components.map(function (component, index) {
                    if (index === 0) {
                        return component.value.replace(/\bNetType\/\w+\b/, '');
                    }
                    return component.value;
                });
                murmur = Fingerprint2.x64hash128(values.join(''), 16);
                while (murmur.length < 16) {
                    murmur += murmur;
                }
                murmur = murmur.slice(0, 16);
                resolve(murmur);
            });
        } catch (e) {
            reject(e);
        }
    });
}

export function getUUID(len?: number) {
    const fullUuid = uuIdV4().replace(/-/g, '');
    return fullUuid.slice(0, len || 16);
}
