import { Actor, HttpAgent, HttpAgentOptions, Agent } from '@dfinity/agent';
import { _SERVICE } from './ledger.did.d';
export type { _SERVICE } from './ledger.did.d';

// Imports and re-exports candid interface
import { idlFactory } from './ledger.did.js';
export { idlFactory } from './ledger.did.js';
// CANISTER_ID is replaced by webpack based on node environment
export const canisterId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

/**
 * @param {string | import("@dfinity/principal").Principal} canisterId Canister ID of Agent
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig} | { agent?: import("@dfinity/agent").Agent; actorOptions?: import("@dfinity/agent").ActorConfig }} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./ledger.did.js")._SERVICE>}
 */
export const createActor = (options?: {
    agentOptions?: HttpAgentOptions;
    actorOptions?: { agent: Agent };
}): _SERVICE => {
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/', // 默认调用线上的接口
        ...options?.agentOptions,
    });

    // Fetch root key for certificate validation during development
    if (process.env.DFX_NETWORK !== 'ic') {
        agent.fetchRootKey().catch((err) => {
            console.warn(
                'Unable to fetch root key. Check to ensure that your local replica is running',
            );
            console.error(err);
        });
    }

    // Creates an actor with using the candid interface and the HttpAgent
    return Actor.createActor(idlFactory, {
        agent,
        canisterId,
        ...options?.actorOptions,
    });
};

/**
 * A ready-to-use agent for the ledger canister
 * @type {import("@dfinity/agent").ActorSubclass<import("./ledger.did.js")._SERVICE>}
 */
export const ledger = createActor();
