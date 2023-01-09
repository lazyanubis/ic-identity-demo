import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl';
import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { IC } from '@astrox/sdk-web';

export type ActorCreator = <T>(
    idlFactory: InterfaceFactory,
    canisterId: string,
) => Promise<ActorSubclass<T>>;

export const getActorCreatorByAgent = (agent: HttpAgent): ActorCreator => {
    return async (idlFactory: InterfaceFactory, canisterId: string) => {
        return Actor.createActor(idlFactory, { agent, canisterId });
    };
};

export interface PlugInterface {
    isConnected: () => Promise<boolean>;
    requestConnect: (_?: {
        whitelist?: string[]; // ['canister-id'],
        host?: string; // 'https://network-address',
        onConnectionUpdate?: () => void;
        timeout?: number; // 毫秒 默认 2 分钟
    }) => Promise<void>;
    sessionManager: {
        sessionData: {
            principalId: string;
            accountId: string;
            agent: HttpAgent;
        };
        onConnectionUpdate: () => void;
    };

    principalId?: string;
    accountId?: string;
    agent?: HttpAgent;
    createActor: <T>(_: {
        canisterId: string;
        interfaceFactory: InterfaceFactory;
    }) => Promise<ActorSubclass<T>>;
}

export const getActorCreatorByPlug = (plug: PlugInterface): ActorCreator => {
    return async (idlFactory: InterfaceFactory, canisterId: string) => {
        return await plug.createActor({
            canisterId,
            interfaceFactory: idlFactory,
        });
    };
};

export const getActorCreatorByIC = (ic: IC): ActorCreator => {
    const identity = ic.identity;
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/', // 默认调用线上的接口
        identity: identity as any,
    });
    return async (idlFactory: InterfaceFactory, canisterId: string) => {
        return Actor.createActor(idlFactory, { agent, canisterId });
    };
    // return async (idlFactory: InterfaceFactory, canisterId: string) => {
    //     return await ic.createActor(idlFactory as any, canisterId);
    // };
};

export const getActorCreatorByActiveProvider = (activeProvider: any): ActorCreator => {
    // const identity = ic.identity;
    // const agent = new HttpAgent({
    //     host: 'https://boundary.ic0.app/', // 默认调用线上的接口
    //     identity: identity as any,
    // });
    // return async (idlFactory: InterfaceFactory, canisterId: string) => {
    //     return Actor.createActor(idlFactory, { agent, canisterId });
    // };
    return async (idlFactory: InterfaceFactory, canisterId: string) => {
        const { value: actor } = await activeProvider.createActor(canisterId, idlFactory);
        return actor;
    };
};
