<script lang="ts" setup>
import { inject, ref } from 'vue';
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
import { ActorSubclass, HttpAgent } from '@dfinity/agent';

const setCreator = inject<(creator: ActorCreator | undefined) => void>('SET_ACTOR_CREATOR')!;

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
        onConnectionUpdate,
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
    if (mainPrincipal.value) {
        (window as any).ic?.plug?.disconnect();
        afterMainLogout();
        setCreator(undefined);
    }
};

const afterMainLogout = () => {
    main = undefined;
    mainPrincipal.value = '';
    mainResult.value = '';
};
</script>

<template>
    <div class="plug-content">
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
