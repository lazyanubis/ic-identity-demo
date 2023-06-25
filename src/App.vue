<script setup lang="ts">
import { provide, readonly, ref } from 'vue';
import InternetIdentityVue from './components/identity/InternetIdentity.vue';
import PlugVue from './components/plug/Plug.vue';
import AstroxMeVue from './components/astrox/AstroxMe.vue';
import WrappedConnect2ICVue from './components/connect2ic/WrappedConnect2IC.vue';
import { HttpAgent } from '@dfinity/agent';
import HelloWorldVue from './components/HelloWorld.vue';
import { ActorCreator } from './components/common';

type SupportType = 'internet-identity' | 'plug' | 'astrox' | 'connect2ic';

const setCurrent = (current: SupportType) => localStorage.setItem('__current__', current);
const getCurrent = (): SupportType => {
    const c = localStorage.getItem('__current__');
    if (c === null) {
        setCurrent('internet-identity');
        return getCurrent();
    }
    return c as SupportType;
};

const current = ref<SupportType>(getCurrent());

const onCurrentChanged = () => {
    console.error('onCurrentChanged ->', current.value);

    setCurrent(current.value);

    // cleanLocalStorage();
    // cleanSessionStorage();
};

const cleanLocalStorage = () => {
    const reserved: string[] = ['vConsole_switch_y', 'vConsole_switch_x', '__current__'];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) as string;
        if (reserved.includes(key)) continue;
        localStorage.removeItem(key);
    }
};
const cleanSessionStorage = () => {
    const reserved: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i) as string;
        if (reserved.includes(key)) continue;
        localStorage.removeItem(key);
    }
};

const setCurrent2 = (current2: 'no-cache' | 'cached') =>
    localStorage.setItem('__current2__', current2);
const getCurrent2 = (): 'no-cache' | 'cached' => {
    const c = localStorage.getItem('__current2__');
    if (c === null) {
        setCurrent2('no-cache');
        return getCurrent2();
    }
    return c as 'no-cache' | 'cached';
};

const current2 = ref<'no-cache' | 'cached'>(getCurrent2());

const onCurrent2Changed = () => {
    console.error('onCurrent2Changed ->', current2.value);

    setCurrent2(current2.value);

    // cleanLocalStorage();
    // cleanSessionStorage();
};
const creator = ref<ActorCreator>();

provide('SET_ACTOR_CREATOR', (c: ActorCreator) => (creator.value = c));
</script>

<template>
    <div class="content">
        <div class="header">
            <select v-model="current" @change="onCurrentChanged">
                <option value="internet-identity">Internet Identity</option>
                <option value="plug">Plug</option>
                <option value="astrox">Astrox ME</option>
                <option value="connect2ic">Connect2IC</option>
            </select>
        </div>
        <div class="item">
            <template v-if="current === 'internet-identity'">
                <InternetIdentityVue />
            </template>
            <template v-else-if="current === 'plug'">
                <PlugVue />
            </template>
            <template v-else-if="current === 'astrox'">
                <AstroxMeVue />
            </template>
            <template v-else-if="current === 'connect2ic'">
                <WrappedConnect2ICVue />
            </template>
        </div>
        <div class="header">
            <select v-model="current2" @change="onCurrent2Changed">
                <option value="no-cache">NoCache</option>
                <option value="cached">Cached</option>
            </select>
        </div>
        <HelloWorldVue :creator="creator" :cached="current2" />
    </div>
</template>

<style lang="less" scoped>
.content {
    > .header {
        > select {
            width: 500px;
            height: 28px;
        }
    }
    > .item {
        margin-top: 20px;
    }
}
</style>
