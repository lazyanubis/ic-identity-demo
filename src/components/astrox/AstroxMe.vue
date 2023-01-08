<script lang="ts" setup>
import { ref } from 'vue';
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

const MAIN_PRINCIPAL = '5wrwy-phdry-6stu5-smhhy-3ngf3-vl2ng-kfosc-bwu6c-kwil6-sgy4e-dqe';
const SUB_PRINCIPAL = 'oc66n-sapan-wpjo2-qolwl-jph74-p42yv-ingdj-xcn6i-afotu-hhaeh-5qe';

class MemoryStorage implements AbstractedClientStorage {
    private data: Record<string, string> = {};
    get(key: string): Promise<string | null> {
        return new Promise((resolve) => {
            resolve(this.data[key] ?? null);
        });
    }
    set(key: string, value: string): Promise<void> {
        return new Promise((resolve) => {
            this.data[key] = value;
            resolve();
        });
    }
    remove(key: string): Promise<void> {
        return new Promise((resolve) => {
            delete this.data[key];
            resolve();
        });
    }
}

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

// 默认登录凭证是存在浏览器 IndexedDB 里面的 auth-client-db-http://xxx 里面的

let mainIC: IC | undefined = undefined;
let mainCreateActor: ActorCreator | undefined = undefined;
const mainPrincipal = ref<string>('');
const mainResult = ref<string>('');

let subIC: IC | undefined = undefined;
let subCreateActor: ActorCreator | undefined = undefined;
const subPrincipal = ref<string>('');
const subResult = ref<string>('');

const onMainLogin = async () => {
    const instance = await IC.create({
        storage: new LocalStorage('astrox-main-'),
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
                storage: new LocalStorage('astrox-main-'),
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

const afterMainLogin = () => {
    const principal = mainIC!.principal.toText();

    mainCreateActor = getActorCreatorByIC(mainIC!);
    mainPrincipal.value = principal;
    mainResult.value = '';

    console.error('main principal', principal);
};

const onMainCall = async () => {
    mainResult.value = '';
    const actor = await mainCreateActor!<_SERVICE>(idlFactory, canisterId);
    console.error('main actor', actor);
    mainResult.value = await actor.hello('main');

    await testNft(mainCreateActor!, 2, mainPrincipal.value, SUB_PRINCIPAL); // 测试调用复杂罐子
    await testLedger(mainCreateActor!); // 测试调用账本罐子
};

const onMainLogout = () => {
    mainIC?.disconnect().then(() => afterMainLogout());
};

const afterMainLogout = () => {
    mainCreateActor = undefined;
    mainPrincipal.value = '';
    mainResult.value = '';
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

const onSubLogin = async () => {
    const instance = await IC.create({
        storage: new LocalStorage('astrox-sub-'),
        useFrame: document.body.clientWidth > 768 ? true : undefined,
        // walletProviderUrl: '',
        onAuthenticated: async (ic: IC) => {
            console.error('sub create onAuthenticated ic', ic);
            subIC = ic;
            afterSubLogin();
        },
    });

    console.error('sub onAuthenticated instance', instance);

    instance.isAuthenticated().then((authenticated) => {
        console.error('sub isAuthenticated', authenticated);
        if (!authenticated) {
            instance.connect({
                storage: new LocalStorage('astrox-sub-'),
                useFrame: !(window.innerWidth < 768),
                signerProviderUrl: 'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/signer',
                // walletProviderUrl: '',
                identityProvider: 'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/login#authorize',
                delegationTargets: [
                    'ipcaz-wiaaa-aaaai-qoy4q-cai', // 测试简单调用
                    // 'ryjl3-tyaaa-aaaaa-aaaba-cai', // 测试转账
                ],
                onAuthenticated: async (ic: IC) => {
                    subIC = ic;
                    afterSubLogin();
                },
            });
        }
    });
};

const afterSubLogin = () => {
    const principal = subIC!.principal.toText();

    subCreateActor = getActorCreatorByIC(subIC!);
    subPrincipal.value = principal;
    subResult.value = '';

    console.error('sub principal', principal);
};

const onSubCall = async () => {
    subResult.value = '';
    const actor = await subCreateActor!<_SERVICE>(idlFactory, canisterId);
    console.error('sub actor', actor);
    subResult.value = await actor.hello('sub');

    await testNft(subCreateActor!, 2, subPrincipal.value, MAIN_PRINCIPAL); // 测试调用复杂罐子
    await testLedger(subCreateActor!); // 测试调用账本罐子
};

const onSubLogout = () => {
    subIC?.disconnect().then(() => afterSubLogout());
};

const afterSubLogout = () => {
    subCreateActor = undefined;
    subPrincipal.value = '';
    subResult.value = '';
};
</script>

<template>
    <div class="astrox-me-content">
        <div class="tip">
            <span>主登录</span>
            <span>{{ mainPrincipal }}</span>
            <span>{{ mainResult }}</span>
        </div>
        <div class="main-login login">
            <div @click="onMainLogin">登录</div>
            <div v-if="mainPrincipal" @click="onMainCall">调用方法</div>
            <div v-if="mainPrincipal" @click="onMainLogout">注销</div>
        </div>
        <hr />
        <div class="tip">
            <span>次登录</span>
            <span>{{ subPrincipal }}</span>
            <span>{{ subResult }}</span>
        </div>
        <div class="sub-login login">
            <div @click="onSubLogin">登录</div>
            <div v-if="subPrincipal" @click="onSubCall">调用方法</div>
            <div v-if="subPrincipal" @click="onSubLogout">注销</div>
        </div>
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
