<script lang="ts" setup>
import { ref, watch } from 'vue';
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

const MAIN_PRINCIPAL = 'ug2vs-7ulmr-5sqwv-kqr47-rkbuj-5wvpb-h5bkb-osfeo-24qvs-bsfvp-nqe';
const SUB_PRINCIPAL = 'l6gbo-ofx6i-6ezfd-gcnt2-2l6bn-fgzfx-g7xoy-22ehb-ya55e-qcq2a-yae';

const { isConnected, connect, activeProvider, provider, principal, disconnect } = useConnect();
const [walletProvider] = useWallet();

watch(
    () => activeProvider.value,
    (activeProvider, prevProvider) => {
        console.error('activeProvider', activeProvider, prevProvider);
        mainCreateActor = activeProvider
            ? getActorCreatorByActiveProvider(activeProvider)
            : undefined;
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

const onMainCall = async () => {
    result.value = '';
    const actor = await mainCreateActor!<_SERVICE>(idlFactory, canisterId);
    console.error('main actor', actor);
    result.value = await actor.hello('main');

    await testNft(mainCreateActor!, 1, principal.value, SUB_PRINCIPAL); // 测试调用复杂罐子
    await testLedger(mainCreateActor!); // 测试调用账本罐子
};

const onMainLogout = () => {
    disconnect();
    afterMainLogout();
};

const afterMainLogout = () => {
    mainCreateActor = undefined;
    result.value = '';
};

const testNft = async (createActor: ActorCreator, index: number, principal: string, to: string) => {
    const nft = await createActor<_SERVICE_NFT>(idlFactoryNft, canisterIdNft);
    const token = await nft.calcTokenIdentifier(index);
    console.error('testNft token', index, token, nft);
    const balanceResult: any = await nft.balance({
        token,
        user: { principal: Principal.fromText(principal) },
    });

    console.error('testNft balance', principal, balanceResult);
    if (balanceResult.err) return;
    if (balanceResult.ok !== BigInt('1')) return;

    const transferResult = await nft.transfer({
        to: { principal: Principal.fromText(to) },
        token: token,
        notify: false,
        from: { principal: Principal.fromText(principal) },
        memo: new Uint8Array(),
        subaccount: [],
        amount: BigInt('1'),
    });
    console.error('testNft transfer to', to, transferResult);
};

const testLedger = async (createActor: ActorCreator) => {
    const ledger = await createActor<_SERVICE_LEDGER>(idlFactoryLedger, canisterIdLedger);
    ledger
        .account_balance_dfx({
            account: 'f3bc18a23254ff0df2e82f1fce9a5b3ffba655b884b4415a8970ae1acebe822d',
        })
        .then((d) => {
            console.error('testLedger ledger balance', d);

            ledger
                .send_dfx({
                    to: 'f3bc18a23254ff0df2e82f1fce9a5b3ffba655b884b4415a8970ae1acebe822d',
                    fee: { e8s: BigInt('10000') },
                    memo: BigInt(0),
                    from_subaccount: [],
                    created_at_time: [],
                    amount: { e8s: BigInt('20000') },
                })
                .then((d) => {
                    console.error('testLedger ledger send', d);
                });
        });
};
</script>

<template>
    <div class="connect2ic-content">
        <div class="tip">
            <span>主登录</span>
            <span>{{ principal }}</span>
            <span>{{ result }}</span>
        </div>
        <div class="main-login login">
            <div @click="onMainLoginByInternetIdentity">Internet Identity 登录</div>
            <div @click="onMainLoginByPlug">Plug 登录</div>
            <div @click="onMainLoginByAstrox">Astrox 登录</div>
            <div v-if="principal" @click="onMainCall">调用方法</div>
            <div v-if="principal" @click="onMainLogout">注销</div>
        </div>
        <hr />
        <div class="tip">
            <span>次登录</span>
            <!-- <span>{{ subPrincipal }}</span>
            <span>{{ subResult }}</span> -->
        </div>
        <div class="sub-login login">
            <!-- <div @click="onSubLogin">登录</div>
            <div v-if="subPrincipal" @click="onSubCall">调用方法</div>
            <div v-if="subPrincipal" @click="onSubLogout">注销</div> -->
        </div>
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
