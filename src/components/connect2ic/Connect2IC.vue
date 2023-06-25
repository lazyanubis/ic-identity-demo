<script lang="ts" setup>
import { inject, ref, watch } from 'vue';
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
import { ActorCreator, getActorCreatorByActiveProvider, getActorCreatorByAgent } from '../common';

import { useConnect, useWallet } from '@connect2ic/vue';
import { HttpAgent } from '@dfinity/agent';

const setCreator = inject<(creator: ActorCreator | undefined) => void>('SET_ACTOR_CREATOR')!;

const { isConnected, connect, activeProvider, provider, principal, disconnect } = useConnect();
const [walletProvider] = useWallet();

watch(
    () => activeProvider.value,
    (activeProvider, prevProvider) => {
        console.error('activeProvider', activeProvider, prevProvider);
        mainCreateActor = activeProvider
            ? getActorCreatorByActiveProvider(activeProvider)
            : undefined;
        setCreator(mainCreateActor);
    },
);
watch(
    () => isConnected.value,
    () => {
        console.error('isConnected', isConnected.value, new Date().getTime());
    },
    {
        immediate: true,
    },
);
watch(
    () => principal.value,
    () => {
        console.error('principal', principal.value);
    },
);

const onMainLoginByInternetIdentity = async () => {
    console.log('connect internet identity');
    connect('ii');
};

const onMainLoginByPlug = async () => {
    console.log('connect plug');
    await connect('plug');
};

const onMainLoginByAstrox = async () => {
    console.log('connect astrox');
    connect((window as any).icx ? 'icx' : 'astrox');
};

let mainCreateActor: ActorCreator | undefined = undefined;
const result = ref<string>('');

const onMainLogout = () => {
    setCreator(undefined);
    disconnect();
    afterMainLogout();
};

const afterMainLogout = () => {
    mainCreateActor = undefined;
    result.value = '';
};
</script>

<template>
    <div class="connect2ic-content">
        <div class="tip">
            <span>登录</span>
            <span>{{ principal }}</span>
            <span>{{ result }}</span>
        </div>
        <div class="main-login login">
            <div @click="onMainLoginByInternetIdentity">Internet Identity 登录</div>
            <div @click="onMainLoginByPlug">Plug 登录</div>
            <div @click="onMainLoginByAstrox">Astrox 登录</div>
            <div v-if="principal" @click="onMainLogout">注销</div>
        </div>
        <hr />
    </div>
</template>

<style lang="less" scoped>
.connect2ic-content {
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
