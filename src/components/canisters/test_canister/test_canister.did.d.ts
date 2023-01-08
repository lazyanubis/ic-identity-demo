import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
    __get_candid_interface_tmp_hack: ActorMethod<[], string>;
    exchange: ActorMethod<[bigint, bigint], [bigint, bigint]>;
    getName: ActorMethod<[], string>;
    hello: ActorMethod<[string], string>;
    negative: ActorMethod<[bigint], bigint>;
    now: ActorMethod<[], bigint>;
    setName: ActorMethod<[string], undefined>;
}
