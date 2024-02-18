<script lang="ts" setup>
import { ref } from 'vue';
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
import { idlFactory as idlFactoryDex } from '../canisters/dex';
import { _SERVICE as _SERVICE_DEX } from '../canisters/dex/index.d';
import { Principal } from '@dfinity/principal';
import { ActorCreator, getActorCreatorByAgent } from '../common';

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

let subClient: AuthClient | undefined = undefined;
let sub:
    | {
          createActor: ActorCreator;
          test: ActorSubclass<_SERVICE>;
          nft: ActorSubclass<_SERVICE_NFT>;
          ledger: ActorSubclass<_SERVICE_LEDGER>;
      }
    | undefined = undefined;
const subPrincipal = ref<string>('');
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

const afterMainLogin = async () => {
    const identity = mainClient!.getIdentity();
    const principal = identity.getPrincipal().toString();
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/', // 默认调用线上的接口
        identity,
    });

    const createActor = getActorCreatorByAgent(agent);
    main = {
        createActor,
        test: await createActor<_SERVICE>(idlFactory, canisterId),
        nft: await createActor<_SERVICE_NFT>(idlFactoryNft, canisterIdNft),
        ledger: await createActor<_SERVICE_LEDGER>(idlFactoryLedger, canisterIdLedger),
    };
    mainPrincipal.value = principal;
    mainResult.value = '';

    let dex = await createActor<_SERVICE_DEX>(idlFactoryDex, '2xiqo-wqaaa-aaaak-aek3a-cai');
    await testDex(dex);

    console.error('main principal', principal);
    console.error('main agent', agent);
};

const onMainCall = async () => {
    mainResult.value = '';
    console.error('main actor test', main!.test);
    mainResult.value = await main!.test.hello('main');

    // await testNft(main!.nft, 1, mainPrincipal.value, SUB_PRINCIPAL); // 测试调用复杂罐子
    // await testLedger(main!.ledger); // 测试调用账本罐子
};
const onMainCall2 = async () => {
    const createActor = main!.createActor;
    const main2 = {
        createActor,
        test: await createActor<_SERVICE>(idlFactory, canisterId),
        nft: await createActor<_SERVICE_NFT>(idlFactoryNft, canisterIdNft),
        ledger: await createActor<_SERVICE_LEDGER>(idlFactoryLedger, canisterIdLedger),
    };
    mainResult.value = '';
    console.error('main2 actor test', main2.test);
    mainResult.value = await main2.test.hello('main2');

    await testNft(main2.nft, 1, mainPrincipal.value, SUB_PRINCIPAL); // 测试调用复杂罐子
    await testLedger(main2.ledger); // 测试调用账本罐子
};

const onMainLogout = () => {
    mainClient?.logout().then(() => afterMainLogout());
};

const afterMainLogout = () => {
    main = undefined;
    mainPrincipal.value = '';
    mainResult.value = '';
};

const testNft = async (
    nft: ActorSubclass<_SERVICE_NFT>,
    index: number,
    principal: string,
    to: string,
) => {
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

const testLedger = async (ledger: ActorSubclass<_SERVICE_LEDGER>) => {
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

const testDex = async (dex: ActorSubclass<_SERVICE_DEX>) => {
    dex.cancelAll(
        {
            self_sa: [],
        },
        [],
    ).then((d) => {
        console.error('testDex dex balance', d);
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

const afterSubLogin = async () => {
    const identity = subClient!.getIdentity();
    const principal = identity.getPrincipal().toString();
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/', // 默认调用线上的接口
        identity,
    });

    const createActor = getActorCreatorByAgent(agent);
    sub = {
        createActor,
        test: await createActor<_SERVICE>(idlFactory, canisterId),
        nft: await createActor<_SERVICE_NFT>(idlFactoryNft, canisterIdNft),
        ledger: await createActor<_SERVICE_LEDGER>(idlFactoryLedger, canisterIdLedger),
    };
    subPrincipal.value = principal;
    subResult.value = '';

    console.error('sub principal', principal);
    console.error('sub agent', agent);
};

const onSubCall = async () => {
    subResult.value = '';
    console.error('sub2 actor test', sub!.test);
    subResult.value = await sub!.test.hello('sub2');

    await testNft(sub!.nft, 1, subPrincipal.value, MAIN_PRINCIPAL); // 测试调用复杂罐子
    await testLedger(sub!.ledger); // 测试调用账本罐子
};
const onSubCall2 = async () => {
    const createActor = sub!.createActor;
    const sub2 = {
        createActor,
        test: await createActor<_SERVICE>(idlFactory, canisterId),
        nft: await createActor<_SERVICE_NFT>(idlFactoryNft, canisterIdNft),
        ledger: await createActor<_SERVICE_LEDGER>(idlFactoryLedger, canisterIdLedger),
    };
    subResult.value = '';
    console.error('sub actor test', sub2.test);
    subResult.value = await sub2.test.hello('sub');

    await testNft(sub2.nft, 1, subPrincipal.value, MAIN_PRINCIPAL); // 测试调用复杂罐子
    await testLedger(sub2.ledger); // 测试调用账本罐子
};

const onSubLogout = () => {
    subClient?.logout().then(() => afterSubLogout());
};

const afterSubLogout = () => {
    sub = undefined;
    subPrincipal.value = '';
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
            <div v-if="!mainPrincipal" @click="onMainLogin">登录</div>
            <div v-if="mainPrincipal" @click="onMainCall">调用方法</div>
            <div v-if="mainPrincipal" @click="onMainCall2">调用方法 - 重新生成 Actor</div>
            <div v-if="mainPrincipal" @click="onMainLogout">注销</div>
        </div>
        <hr />
        <div class="tip">
            <span>次登录</span>
            <span>{{ subPrincipal }}</span>
            <span>{{ subResult }}</span>
        </div>
        <div class="sub-login login">
            <div v-if="!subPrincipal" @click="onSubLogin">登录</div>
            <div v-if="subPrincipal" @click="onSubCall">调用方法</div>
            <div v-if="subPrincipal" @click="onSubCall2">调用方法 - 重新生成 Actor</div>
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
