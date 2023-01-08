<script setup lang="ts">
import { ref } from 'vue';
import InternetIdentityVue from './components/identity/InternetIdentity.vue';
import PlugVue from './components/plug/Plug.vue';
import AstroxMeVue from './components/astrox/AstroxMe.vue';


type SupportType = 'internet-identity' | 'plug' | 'astrox';

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
</script>

<template>
    <div class="content">
        <div class="header">
            <select v-model="current" @change="onCurrentChanged">
                <option value="internet-identity">Internet Identity</option>
                <option value="plug">Plug</option>
                <option value="astrox">Astrox ME</option>
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
