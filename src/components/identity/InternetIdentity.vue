<script lang="ts" setup>
import { ref } from 'vue';
import { AuthClientStorage, LocalStorage } from '@dfinity/auth-client/lib/cjs/storage';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent, Identity } from '@dfinity/agent';
import { createActor } from '../canisters/test_canister';
import { createActor as createLedgerActor } from '../canisters/ledger';
import { createActor as createNftActor } from '../canisters/nft';
import { Principal } from '@dfinity/principal';

const MAIN_PRINCIPAL = 'ug2vs-7ulmr-5sqwv-kqr47-rkbuj-5wvpb-h5bkb-osfeo-24qvs-bsfvp-nqe';
const SUB_PRINCIPAL = 'l6gbo-ofx6i-6ezfd-gcnt2-2l6bn-fgzfx-g7xoy-22ehb-ya55e-qcq2a-yae';

// 默认登录凭证是存在浏览器 IndexedDB 里面的 auth-client-db-http://xxx 里面的

// 组件内临时内存，离开即丢失
class MemoryStorage implements AuthClientStorage {
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

let mainClient: AuthClient | undefined = undefined;
let mainIdentity: Identity | undefined = undefined;
const mainPrincipal = ref<string>('');
let mainAgent: HttpAgent | undefined = undefined;
const mainResult = ref<string>('');

let subClient: AuthClient | undefined = undefined;
let subIdentity: Identity | undefined = undefined;
const subPrincipal = ref<string>('');
let subAgent: HttpAgent | undefined = undefined;
const subResult = ref<string>('');

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
    });
};

const afterMainLogin = () => {
    const identity = mainClient!.getIdentity();
    const principal = identity.getPrincipal().toString();
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/', // 默认调用线上的接口
        identity,
    });

    mainIdentity = identity;
    mainPrincipal.value = principal;
    mainAgent = agent;
    mainResult.value = '';

    console.error('main identity', identity);
    console.error('main principal', principal);
    console.error('main agent', agent);
};

const onMainCall = async () => {
    mainResult.value = '';
    const actor = createActor({ actorOptions: { agent: mainAgent! } });
    console.error('main actor', actor);
    mainResult.value = await actor.hello('main');

    await testNft(mainAgent!, 1, mainPrincipal.value, SUB_PRINCIPAL); // 测试调用复杂罐子
    await testLedger(mainAgent!); // 测试调用账本罐子
};

const onMainLogout = () => {
    mainClient?.logout().then(() => afterMainLogout());
};

const afterMainLogout = () => {
    mainIdentity = undefined;
    mainPrincipal.value = '';
    mainAgent = undefined;
    mainResult.value = '';
};

const testNft = async (agent: HttpAgent, index: number, principal: string, to: string) => {
    const nft = createNftActor({ actorOptions: { agent } });
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

const testLedger = async (agent: HttpAgent) => {
    const ledger = createLedgerActor({ actorOptions: { agent } });
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
    subClient = await AuthClient.create({
        // storage: new MemoryStorage(),
        storage: new LocalStorage('internet-identity-2:'), // 可以指定前缀保存到 localStorage 里面
    });

    if (subClient === undefined) throw new Error('sub client can not be undefined');

    const isAuthenticated = await subClient.isAuthenticated();
    if (isAuthenticated) {
        console.error('sub isAuthenticated');
        afterSubLogin();
        return;
    }

    subClient.login({
        identityProvider: 'https://identity.ic0.app', // 这就是默认值
        maxTimeToLive: BigInt('3600000000000'), // 默认 8 小时，改成 1 小时
        // 打开窗口?
        windowOpenerFeatures:
            'toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100',
        onSuccess: () => {
            console.log('Sub Login Successful!');
            afterSubLogin();
        },
        onError: (error) => {
            console.error('Sub Login Failed:', error);
        },
    });
};

const afterSubLogin = () => {
    const identity = subClient!.getIdentity();
    const principal = identity.getPrincipal().toString();
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/', // 默认调用线上的接口
        identity,
    });

    subIdentity = identity;
    subPrincipal.value = principal;
    subAgent = agent;
    subResult.value = '';

    console.error('sub identity', identity);
    console.error('sub principal', principal);
    console.error('sub agent', agent);
};

const onSubCall = async () => {
    subResult.value = '';
    const actor = createActor({ actorOptions: { agent: subAgent! } });
    console.error('sub actor', actor);
    subResult.value = await actor.hello('sub');

    await testNft(subAgent!, 1, subPrincipal.value, MAIN_PRINCIPAL); // 测试调用复杂罐子
    await testLedger(subAgent!); // 测试调用账本罐子
};

const onSubLogout = () => {
    subClient?.logout().then(() => afterSubLogout());
};

const afterSubLogout = () => {
    subIdentity = undefined;
    subPrincipal.value = '';
    subAgent = undefined;
    subResult.value = '';
};
</script>

<template>
    <div class="internet-identity-content">
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
