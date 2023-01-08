<script lang="ts" setup>
import { ref } from 'vue';
import { HttpAgent } from '@dfinity/agent';
import { createActor } from '../canisters/test_canister';
import { createActor as createNftActor } from '../canisters/nft';
import { createActor as createLedgerActor } from '../canisters/ledger';
import { Principal } from '@dfinity/principal';

const MAIN_PRINCIPAL = '37pej-6oomu-uuzj2-ecmh3-ibavk-qtrkn-bhz4v-vgusr-z7k4r-yatqo-uae';
const SUB_PRINCIPAL = 's3zx7-klabw-jftqa-voxdq-wmf2s-l5pdg-zxjkl-tnpfq-pcajr-tgn2d-rae';

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

    await testNft(mainAgent!, 0, mainPrincipal.value, SUB_PRINCIPAL); // 测试调用复杂罐子
    const accountId = (window as any).ic?.plug?.sessionManager.sessionData?.accountId;
    await testLedger(mainAgent!, accountId); // 测试调用账本罐子
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

const testLedger = async (agent: HttpAgent, accountId: string) => {
    const ledger = createLedgerActor({ actorOptions: { agent } });
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

    await testNft(subAgent!, 0, subPrincipal.value, MAIN_PRINCIPAL); // 测试调用复杂罐子
    const accountId = (window as any).ic?.plug?.sessionManager.sessionData?.accountId;
    await testLedger(subAgent!, accountId); // 测试调用账本罐子
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
