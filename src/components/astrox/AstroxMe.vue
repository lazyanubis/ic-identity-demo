<script lang="ts" setup>
import { inject, ref } from 'vue';
import { IC } from '@astrox/sdk-web';
import { AbstractedClientStorage } from '@astrox/sdk-core';
import { idlFactory, canisterId, _SERVICE } from '../canisters/test_canister';
import {
    idlFactory as idlFactoryNft,
    canisterId as canisterIdNft,
    _SERVICE as _SERVICE_NFT,
} from '../canisters/nft';
import {
    idlFactory as idlFactoryLedger,
    canisterId as canisterIdLedger,
    _SERVICE as _SERVICE_LEDGER,
} from '../canisters/ledger';
import { Principal } from '@dfinity/principal';
import { ActorCreator, getActorCreatorByIC } from '../common';
import { PermissionsType } from '@astrox/sdk-web/build/types';
import { ActorSubclass, HttpAgent } from '@dfinity/agent';

const setCreator = inject<(creator: ActorCreator | undefined) => void>('SET_ACTOR_CREATOR')!;

class LocalStorage implements AbstractedClientStorage {
    private prefix: string;
    constructor(prefix: string) {
        this.prefix = prefix;
    }
    get(key: string): Promise<string | null> {
        return new Promise((resolve) => {
            resolve(localStorage.getItem(this.prefix + key));
        });
    }
    set(key: string, value: string): Promise<void> {
        return new Promise((resolve) => {
            localStorage.setItem(this.prefix + key, value);
            resolve();
        });
    }
    remove(key: string): Promise<void> {
        return new Promise((resolve) => {
            localStorage.removeItem(this.prefix + key);
            resolve();
        });
    }
}

let mainIC: IC | undefined = undefined;
let main:
    | {
          createActor: ActorCreator;
          test: ActorSubclass<_SERVICE>;
          nft: ActorSubclass<_SERVICE_NFT>;
          ledger: ActorSubclass<_SERVICE_LEDGER>;
      }
    | undefined = undefined;
const mainPrincipal = ref<string>('');
const mainResult = ref<string>('');

const onMainLogin = async () => {
    const storage = new LocalStorage('astrox-main-'); // 默认是 astrox-
    const instance = await IC.create({
        storage,
        permissions: [PermissionsType.identity],
        maxTimeToLive: BigInt('600000000000'), // 纳秒
        useFrame: document.body.clientWidth > 768 ? true : undefined,
        // walletProviderUrl: '',
        onAuthenticated: async (ic: IC) => {
            console.error('main create onAuthenticated ic', ic);
            mainIC = ic;
            afterMainLogin();
        },
    });

    console.error('main onAuthenticated instance', instance);

    instance.isAuthenticated().then((authenticated) => {
        console.error('main isAuthenticated', authenticated);
        if (!authenticated) {
            instance.connect({
                storage,
                permissions: [PermissionsType.identity],
                maxTimeToLive: BigInt('600000000000'), // 纳秒
                useFrame: !(window.innerWidth < 768),
                // signerProviderUrl: 'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/signer',
                // walletProviderUrl: 'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/transaction',
                identityProvider: 'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/login#authorize',
                delegationTargets: [
                    'ipcaz-wiaaa-aaaai-qoy4q-cai', // 测试简单调用
                    'dkroc-xyaaa-aaaai-qozbq-cai', // 测试简单调用
                    // 'ryjl3-tyaaa-aaaaa-aaaba-cai', // 测试转账
                ],
                onAuthenticated: async (ic: IC) => {
                    mainIC = ic;
                    afterMainLogin();
                },
            });
        }
    });
};

const afterMainLogin = async () => {
    const principal = mainIC!.principal.toText();

    const createActor = getActorCreatorByIC(mainIC!);
    setCreator(createActor);
    main = {
        createActor,
        test: await createActor<_SERVICE>(idlFactory, canisterId),
        nft: await createActor<_SERVICE_NFT>(idlFactoryNft, canisterIdNft),
        ledger: await createActor<_SERVICE_LEDGER>(idlFactoryLedger, canisterIdLedger),
    };
    mainPrincipal.value = principal;
    mainResult.value = '';

    console.error('main principal', principal);
};

const onMainLogout = () => {
    mainIC?.disconnect().then(() => afterMainLogout());
    setCreator(undefined);
};

const afterMainLogout = () => {
    main = undefined;
    mainPrincipal.value = '';
    mainResult.value = '';
};
</script>

<template>
    <div class="astrox-me-content">
        <div class="tip">
            <span>登录</span>
            <span>{{ mainPrincipal }}</span>
            <span>{{ mainResult }}</span>
        </div>
        <div class="main-login login">
            <div v-if="!mainPrincipal" @click="onMainLogin">登录</div>
            <div v-if="mainPrincipal" @click="onMainLogout">注销</div>
        </div>
        <hr />
    </div>
</template>

<style lang="less" scoped>
.astrox-me-content {
    width: 100%;
    > .tip {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        > span:first-child {
            font-size: 30px;
            margin-top: 10px;
            margin-bottom: 10px;
        }
    }
    > .login {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        > div {
            margin: 5px 0;
            width: 200px;
            border: 1px solid #555;
            border-radius: 5px;
            cursor: pointer;
            &:hover {
                border: 1px solid #aaa;
            }
        }
    }
}
</style>
