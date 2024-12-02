import { SDK } from '../lib/main';

const sdk = new SDK();

function get32UUID() {
    return sdk.get32UUID();
}
function get16UUID() {
    return sdk.get16UUID();
}
export { get32UUID, get16UUID };
