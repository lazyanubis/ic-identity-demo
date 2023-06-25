<script lang="ts" setup>
import { inject, ref } from 'vue';
import { AuthClientStorage, LocalStorage } from '@dfinity/auth-client/lib/cjs/storage';
import { AuthClient } from '@dfinity/auth-client';
import { ActorSubclass, HttpAgent } from '@dfinity/agent';
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
import { ActorCreator, getActorCreatorByAgent } from '../common';

const setCreator = inject<(creator: ActorCreator | undefined) => void>('SET_ACTOR_CREATOR')!;

// 默认登录凭证是存在浏览器 IndexedDB 里面的 auth-client-db-http://xxx 里面的

let mainClient: AuthClient | undefined = undefined;
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
    mainClient = await AuthClient.create();

    if (mainClient === undefined) throw new Error('main client can not be undefined');

    const isAuthenticated = await mainClient.isAuthenticated();
    if (isAuthenticated) {
        console.error('main isAuthenticated');
        afterMainLogin();
        return;
    }

    mainClient.login({
        onSuccess: () => {
            console.log('Main Login Successful!');
            afterMainLogin();
        },
        onError: (error) => {
            console.error('Main Login Failed:', error);
        },
        derivationOrigin: 'https://ipcaz-wiaaa-aaaai-qoy4q-cai.raw.ic0.app',
    });
};

const afterMainLogin = async () => {
    const identity = mainClient!.getIdentity();
    const principal = identity.getPrincipal().toString();
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/', // 默认调用线上的接口
        identity,
    });

    const createActor = getActorCreatorByAgent(agent);
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
    console.error('main agent', agent);
};

const onMainLogout = () => {
    mainClient?.logout().then(() => afterMainLogout());
    setCreator(undefined);
};

const afterMainLogout = () => {
    main = undefined;
    mainPrincipal.value = '';
    mainResult.value = '';
};
</script>

<template>
    <div class="internet-identity-content">
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
.internet-identity-content {
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
