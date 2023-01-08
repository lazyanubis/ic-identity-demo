<script lang="ts" setup>
import { ref } from 'vue';
import { AuthClientStorage, LocalStorage } from '@dfinity/auth-client/lib/cjs/storage';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent, Identity } from '@dfinity/agent';
import { createActor } from '../canisters/test_canister';

const mainPrincipal = ref<string>('');
let mainAgent: HttpAgent | undefined = undefined;
const mainResult = ref<string>('');

const subPrincipal = ref<string>('');
let subAgent: HttpAgent | undefined = undefined;
const subResult = ref<string>('');

const onMainLogin = async () => {
    const plug = (window as any).ic?.plug;

    if (plug === undefined) throw new Error('plug can not be undefined');

    console.error('plug', plug, plug.agent);

    const whitelist = ['ipcaz-wiaaa-aaaai-qoy4q-cai'];

    plug.requestConnect({ whitelist })
        .then((r: any) => {
            console.error('allow', r, plug.agent);
            afterMainLogin(plug.agent as HttpAgent);
        })
        .catch((e: any) => {
            // Error: The agent creation was rejected. // 直接点拒绝会返回这个
            console.error('e', `${e}`);
        });
};

const afterMainLogin = async (agent: HttpAgent) => {
    const principal = (await agent.getPrincipal()).toText();

    mainPrincipal.value = principal;
    mainAgent = agent;
    mainResult.value = '';

    console.error('main principal', principal);
    console.error('main agent', agent);
};

const onMainCall = async () => {
    mainResult.value = '';
    const actor = createActor({ actorOptions: { agent: mainAgent! } });
    console.error('main actor', actor);
    mainResult.value = await actor.hello('main');
};

const onMainLogout = () => {
    if (mainPrincipal.value) {
        (window as any).ic?.plug?.disconnect();
    afterMainLogout();
    }
};

const afterMainLogout = () => {
    mainPrincipal.value = '';
    mainAgent = undefined;
    mainResult.value = '';
};

const onSubLogin = async () => {
    const plug = (window as any).ic?.plug;

    if (plug === undefined) throw new Error('plug can not be undefined');

    console.error('plug', plug, plug.agent);

    const whitelist = ['ipcaz-wiaaa-aaaai-qoy4q-cai'];

    plug.requestConnect({ whitelist })
        .then((r: any) => {
            console.error('allow', r, plug.agent);
            afterSubLogin(plug.agent as HttpAgent);
        })
        .catch((e: any) => {
            // Error: The agent creation was rejected. // 直接点拒绝会返回这个
            console.error('e', `${e}`);
        });
};

const afterSubLogin = async (agent: HttpAgent) => {
    const principal = (await agent.getPrincipal()).toText();

    subPrincipal.value = principal;
    subAgent = agent;
    subResult.value = '';

    console.error('sub principal', principal);
    console.error('sub agent', agent);
};

const onSubCall = async () => {
    subResult.value = '';
    const actor = createActor({ actorOptions: { agent: subAgent! } });
    console.error('sub actor', actor);
    subResult.value = await actor.hello('sub');
};

const onSubLogout = () => {
    if (subPrincipal.value) {
        // (window as any).ic?.plug?.disconnect(); // 次登录本身没有记录
    afterSubLogout();
    }
};

const afterSubLogout = () => {
    subPrincipal.value = '';
    subAgent = undefined;
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
