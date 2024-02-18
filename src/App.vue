<script setup lang="ts">
import { ref } from 'vue';
import InternetIdentityVue from './components/identity/InternetIdentity.vue';
import PlugVue from './components/plug/Plug.vue';
import AstroxMeVue from './components/astrox/AstroxMe.vue';
import WrappedConnect2ICVue from './components/connect2ic/WrappedConnect2IC.vue';
import { Ed25519KeyIdentity } from '@dfinity/identity/lib/cjs/identity/ed25519';

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

const INDEXED_DB =
    window.indexedDB ||
    (window as any).mozIndexedDB ||
    (window as any).webkitIndexedDB ||
    (window as any).msIndexedDB ||
    (window as any).shimIndexedDB;

setTimeout(() => {
    console.log('xxxxxxx');

    let delegation_string = 'xx';
    let identity_string = 'xx';
    const delegation = JSON.parse(delegation_string);
    const identity = JSON.parse(identity_string);

    console.log('xxxxxxx identity', delegation, identity);

    // let ii = Ed25519KeyIdentity.fromParsedJson(identity);
    // let p = ii.getPrincipal();
    // console.error('xxx p', p.toText());

    const connection = INDEXED_DB.open('auth-client-db');
    connection.onsuccess = () => {
        const db = connection.result;
        console.error('rrrrr', db);
        const transaction = db.transaction('ic-keyval', 'readwrite');
        const store = transaction.objectStore('ic-keyval');
        // const request = store.getAllKeys();
        // const request = store.add('123', 'delegation');

        // request.onsuccess = () => {
        //     console.error('rrrrr', request);
        //     console.error('rrrrr', request.result);
        // };

        const request2 = store.put(delegation_string, 'delegation');
        request2.onsuccess = (e: any) => {
            console.log(e.target.result);
        };
        const request = store.put(identity_string, 'identity');
        request.onsuccess = (e: any) => {
            console.log(e.target.result);
        };
    };
}, 1000);
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
