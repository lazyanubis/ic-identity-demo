import { IDL } from '@dfinity/candid';
import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { IC } from '@astrox/sdk-web';

export type ActorCreator = <T>(
    idlFactory: IDL.InterfaceFactory,
    canisterId: string,
) => Promise<ActorSubclass<T>>;

// Internet Identity 提供 agent
export const getActorCreatorByAgent = (agent: HttpAgent): ActorCreator => {
    return async (idlFactory: IDL.InterfaceFactory, canisterId: string) => {
        return Actor.createActor(idlFactory, { agent, canisterId });
    };
};

// Plug 的接口类型
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
        interfaceFactory: IDL.InterfaceFactory;
    }) => Promise<ActorSubclass<T>>;
}

// Plug 提供 plug
export const getActorCreatorByPlug = (plug: PlugInterface): ActorCreator => {
    return async (idlFactory: IDL.InterfaceFactory, canisterId: string) => {
        return await plug.createActor({
            canisterId,
            interfaceFactory: idlFactory,
        });
    };
};

// Astrox ME 提供 IC
export const getActorCreatorByIC = (ic: IC): ActorCreator => {
    const identity = ic.identity;
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/', // 默认调用线上的接口
        identity: identity as any,
    });
    return async (idlFactory: IDL.InterfaceFactory, canisterId: string) => {
        return Actor.createActor(idlFactory, { agent, canisterId });
    };
    // return async (idlFactory: InterfaceFactory, canisterId: string) => {
    //     return await ic.createActor(idlFactory, canisterId);
    // };
};

// connect2ic 提供 activeProvider
export const getActorCreatorByActiveProvider = (activeProvider: any): ActorCreator => {
    return async (idlFactory: IDL.InterfaceFactory, canisterId: string) => {
        const { value: actor } = await activeProvider.createActor(canisterId, idlFactory);
        return actor;
    };
};
