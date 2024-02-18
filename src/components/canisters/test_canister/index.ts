import { Actor, HttpAgent, HttpAgentOptions, Agent } from '@dfinity/agent';
import { _SERVICE } from './test_canister.did.d';
export type { _SERVICE } from './test_canister.did.d';

// Imports and re-exports candid interface
import { idlFactory } from './test_canister.did.js';
export { idlFactory } from './test_canister.did.js';
// CANISTER_ID is replaced by webpack based on node environment
export const canisterId = 'ipcaz-wiaaa-aaaai-qoy4q-cai';

/**
 * @param {string | import("@dfinity/principal").Principal} canisterId Canister ID of Agent
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./test_canister.did.js")._SERVICE>}
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
    // if (process.env.NODE_ENV !== 'production') {
    //     agent.fetchRootKey().catch((err) => {
    //         console.warn(
    //             'Unable to fetch root key. Check to ensure that your local replica is running',
    //         );
    //         console.error(err);
    //     });
    // }

    // Creates an actor with using the candid interface and the HttpAgent
    return Actor.createActor(idlFactory, {
        agent,
        canisterId,
        ...options?.actorOptions,
    });
};

/**
 * A ready-to-use agent for the test_canister canister
 * @type {import("@dfinity/agent").ActorSubclass<import("./test_canister.did.js")._SERVICE>}
 */
export const test_canister = createActor();
