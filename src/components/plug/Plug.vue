<script lang="ts" setup>
import { ref } from 'vue';
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
import { ActorCreator, getActorCreatorByPlug, PlugInterface } from '../common';
import { ActorSubclass } from '@dfinity/agent';

const MAIN_PRINCIPAL = '37pej-6oomu-uuzj2-ecmh3-ibavk-qtrkn-bhz4v-vgusr-z7k4r-yatqo-uae';
const SUB_PRINCIPAL = 's3zx7-klabw-jftqa-voxdq-wmf2s-l5pdg-zxjkl-tnpfq-pcajr-tgn2d-rae';

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
    const plug = (window as any).ic?.plug as PlugInterface;

    if (plug === undefined) throw new Error('plug can not be undefined');

    console.error('main plug', plug);

    const onConnectionUpdate = () => {
        console.error('main onConnectionUpdate', plug.sessionManager);
        console.error('main onConnectionUpdate', plug.sessionManager.sessionData?.principalId);
        console.error('main onConnectionUpdate', plug.sessionManager.sessionData?.accountId);
        const agent = plug.sessionManager.sessionData?.agent;
        if (agent) afterMainLogin(plug);
    };
    plug.sessionManager.onConnectionUpdate = onConnectionUpdate;

    // 调用这个方法就会把上次的缓存加入
    // 主调用要尝试从缓存中查找上次的 agent
    // 目标位置 window.ic.plug.sessionManager.sessionData，不调用 isConnected方法的话，是 null

    console.error('main before isConnected', plug.sessionManager.sessionData);
    const isConnected = await new Promise(async (resolve) => {
        const timeout = setTimeout(() => resolve(false), 333);
        const connected = await plug.isConnected();
        clearTimeout(timeout);
        resolve(connected);
    });
    console.error('main isConnected', isConnected);
    if (isConnected) {
        console.error(
            'main after isConnected and connected',
            plug.sessionManager.sessionData?.principalId,
        );
        console.error(
            'main after isConnected and connected',
            plug.sessionManager.sessionData?.accountId,
        );
        console.error('main after isConnected and connected', plug.sessionManager);
        const agent = plug.sessionManager.sessionData.agent;
        if (agent) {
            console.error('main using session data');
            afterMainLogin(plug).catch((e) => {
                console.error('e', e);
            });
            return;
        }
    }

    const whitelist: string[] = ['ipcaz-wiaaa-aaaai-qoy4q-cai', 'ryjl3-tyaaa-aaaaa-aaaba-cai'];

    // timeout 也无法防止用户关闭弹窗
    plug.requestConnect({
        whitelist,
        // onConnectionUpdate,
        timeout: 60000,
    })
        .then((d) => {
            console.error('public key', d);
            const agent = plug.agent;
            if (!agent) throw new Error('agent must be valid.');
            console.error('Main Login Successful!');
            afterMainLogin(plug);
        })
        .catch((error: any) => {
            // Error: The agent creation was rejected. // 直接点拒绝会返回这个
            console.error('Sub Login Failed:', `${error}`);
        });

    // ! plug 的弹框如果被关闭了，那么不会报错 // 其实无所谓，反正还是没登录的状态
    // (async () => {
    //     return new Promise(async (resolve, reject) => {
    //         const timeout = setTimeout(() => reject(new Error('Timeout for 60s')), 60000); // 等一分钟
    //         const result = await plug.requestConnect({ whitelist });
    //         clearTimeout(timeout);
    //         resolve(result);
    //     });
    // })()
    //     .then((r: any) => {
    //         console.error('allow', r, plug.agent);
    //         afterMainLogin(plug);
    //     })
    //     .catch((e: any) => {
    //         // Error: The agent creation was rejected. // 直接点拒绝会返回这个
    //         console.error('plug requestConnect failed:', `${e}`);
    //     });
};

const afterMainLogin = async (plug: PlugInterface) => {
    const principal = (await plug.sessionManager.sessionData.agent.getPrincipal()).toText();

    const createActor = getActorCreatorByPlug(plug);
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

const onMainCall = async () => {
    mainResult.value = '';
    console.error('main actor test', main!.test);
    mainResult.value = await main!.test.hello('main');

    // 测试调用复杂罐子
    testNft(main!.nft, 0, mainPrincipal.value, SUB_PRINCIPAL).finally(() => {
        const accountId = (window as any).ic?.plug?.sessionManager.sessionData?.accountId;
        testLedger(main!.ledger, accountId); // 测试调用账本罐子
    });
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

    // 测试调用复杂罐子
    testNft(main2.nft, 0, mainPrincipal.value, SUB_PRINCIPAL).finally(() => {
        const accountId = (window as any).ic?.plug?.sessionManager.sessionData?.accountId;
        testLedger(main2.ledger, accountId); // 测试调用账本罐子
    });
};

const onMainLogout = () => {
    if (mainPrincipal.value) {
        (window as any).ic?.plug?.disconnect();
        afterMainLogout();
    }
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
        memo: [] as any,
        subaccount: [],
        amount: BigInt('1'),
    });
    console.error('testNft transfer to', to, transferResult);
};

const testLedger = async (ledger: ActorSubclass<_SERVICE_LEDGER>, accountId: string) => {
    ledger.account_balance_dfx({ account: accountId }).then((d) => {
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
    const plug = (window as any).ic?.plug as PlugInterface;

    if (plug === undefined) throw new Error('plug can not be undefined');

    console.error('sub plug', plug);

    const onConnectionUpdate = () => {
        console.error('sub onConnectionUpdate', plug.sessionManager);
        console.error('sub onConnectionUpdate', plug.sessionManager.sessionData?.principalId);
        console.error('sub onConnectionUpdate', plug.sessionManager.sessionData?.accountId);
        const agent = plug.sessionManager.sessionData?.agent;
        if (agent) afterSubLogin(plug);
    };
    plug.sessionManager.onConnectionUpdate = onConnectionUpdate;

    console.error('sub before isConnected', plug.sessionManager.sessionData);
    const isConnected = await new Promise(async (resolve) => {
        const timeout = setTimeout(() => resolve(false), 333);
        const connected = await plug.isConnected();
        clearTimeout(timeout);
        resolve(connected);
    });
    console.error('sub isConnected', isConnected);
    if (isConnected) {
        console.error(
            'sub after isConnected and connected',
            plug.sessionManager.sessionData?.principalId,
        );
        console.error(
            'sub after isConnected and connected',
            plug.sessionManager.sessionData?.accountId,
        );
        console.error('sub after isConnected and connected', plug.sessionManager);
        const agent = plug.sessionManager.sessionData.agent;
        if (agent) {
            console.error('sub using session data');
            afterSubLogin(plug);
            return;
        }
    }

    console.error('plug', plug, plug.agent);

    const whitelist: string[] = ['ipcaz-wiaaa-aaaai-qoy4q-cai'];

    plug.requestConnect({
        whitelist,
        timeout: 60000, // 默认是 2 分钟
    })
        .then((r: any) => {
            const agent = plug.agent;
            if (!agent) throw new Error('agent must be valid.');
            console.error('Main Login Successful!');
            afterSubLogin(plug);
        })
        .catch((e: any) => {
            // Error: The agent creation was rejected. // 直接点拒绝会返回这个
            console.error('Sub Login Failed:', `${e}`);
        })
        .finally(() => {
            console.error('final');
            // console.error('final', isConnected, sessionData);
            // if (isConnected && sessionData) {
            //     plug.sessionManager.sessionData = sessionData;
            // }
        });
};

const afterSubLogin = async (plug: PlugInterface) => {
    const principal = (await plug.sessionManager.sessionData.agent.getPrincipal()).toText();

    const createActor = getActorCreatorByPlug(plug);
    sub = {
        createActor,
        test: await createActor<_SERVICE>(idlFactory, canisterId),
        nft: await createActor<_SERVICE_NFT>(idlFactoryNft, canisterIdNft),
        ledger: await createActor<_SERVICE_LEDGER>(idlFactoryLedger, canisterIdLedger),
    };
    subPrincipal.value = principal;
    subResult.value = '';

    console.error('sub principal', principal);
};

const onSubCall = async () => {
    subResult.value = '';
    console.error('sub2 actor test', sub!.test);
    subResult.value = await sub!.test.hello('sub2');

    // 测试调用复杂罐子
    testNft(sub!.nft, 0, subPrincipal.value, MAIN_PRINCIPAL).finally(() => {
        const accountId = (window as any).ic?.plug?.sessionManager.sessionData?.accountId;
        testLedger(sub!.ledger, accountId); // 测试调用账本罐子
    });
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

    // 测试调用复杂罐子
    testNft(sub2.nft, 0, subPrincipal.value, MAIN_PRINCIPAL).finally(() => {
        const accountId = (window as any).ic?.plug?.sessionManager.sessionData?.accountId;
        testLedger(sub2.ledger, accountId); // 测试调用账本罐子
    });
};

const onSubLogout = () => {
    if (subPrincipal.value) {
        // (window as any).ic?.plug?.disconnect(); // 次登录本身没有记录
        afterSubLogout();
    }
};

const afterSubLogout = () => {
    sub = undefined;
    subPrincipal.value = '';
    subResult.value = '';
};
</script>

<template>
    <div class="plug-content">
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
.plug-content {
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
