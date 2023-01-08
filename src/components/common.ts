import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl';
import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';

export type ActorCreator = <T>(
    idlFactory: InterfaceFactory,
    canisterId: string,
) => Promise<ActorSubclass<T>>;

export const getActorCreatorByAgent = (agent: HttpAgent): ActorCreator => {
    return async (idlFactory: InterfaceFactory, canisterId: string) => {
        return Actor.createActor(idlFactory, { agent, canisterId });
    };
};
