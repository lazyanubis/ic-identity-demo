<script lang="ts" setup>
import Connect2ICVue from './Connect2IC.vue';
import { AbstractedClientStorage } from '@astrox/sdk-core';
import { LocalStorage as IILocalStorage } from '@dfinity/auth-client/lib/cjs/storage';

import { Connect2ICProvider } from '@connect2ic/vue';
import { createClient } from '@connect2ic/core';
import { AstroX, ICX, PlugWallet, InternetIdentity } from '@connect2ic/core/providers';
import '@connect2ic/core/style.css';

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
const astroxProvider = (window as any).icx
    ? new ICX({
          providerUrl: 'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/',
          storage: new LocalStorage('astrox-main-'),
      })
    : new AstroX({
          providerUrl: 'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/',
          delegationModes: ['global'],
          storage: new LocalStorage('astrox-main-'),
      });
const client = createClient({
    providers: [
        astroxProvider,
        new PlugWallet(),
        new InternetIdentity({
            storage: new IILocalStorage('internet-identity-2:'),
        }),
    ],
    globalProviderConfig: {
        host: 'https://boundary.ic0.app/',
        autoConnect: false,
        whitelist: [
            'ipcaz-wiaaa-aaaai-qoy4q-cai',
            // 'ryjl3-tyaaa-aaaaa-aaaba-cai',
            'dkroc-xyaaa-aaaai-qozbq-cai',
        ],
    },
});
client.on('init', () => {
    console.error('init');
});
client.on('connect', () => {
    console.error('connect');
});
client.connect(astroxProvider);
</script>

<template>
    <Connect2ICProvider :client="client">
        <div class="wrapped-connect2ic-content">
            <Connect2ICVue />
        </div>
    </Connect2ICProvider>
</template>

<style lang="less" scoped>
.wrapped-connect2ic-content {
    width: 100%;
}
</style>
