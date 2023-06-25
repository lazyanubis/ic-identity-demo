<script setup lang="ts">
import { PropType, nextTick, ref, watch } from 'vue';
import { ActorCreator } from './common';
import { idlFactory as idlFactoryNft, _SERVICE as _SERVICE_NFT } from './canisters/nft';
import { Principal } from '@dfinity/principal';

const props = defineProps<{ creator?: ActorCreator; cached: 'no-cache' | 'cached' }>();

const show = ref(true);

const canisters = ref([
    '66orv-hqaaa-aaaah-acmnq-cai',
    'algz6-lqaaa-aaaap-aakza-cai',
    'zdxun-dyaaa-aaaap-aa3ma-cai',
    'tajq6-syaaa-aaaap-aaw3a-cai',
    '5btbh-2aaaa-aaaap-aaqga-cai',
    'jx6g3-miaaa-aaaap-aamwa-cai',
    'shkzf-7iaaa-aaaah-addwq-cai',
    '47moi-iqaaa-aaaap-aa3tq-cai',
    '3hzxy-fyaaa-aaaap-aaiiq-cai',
    '355dh-iiaaa-aaaap-aa46q-cai',
    'qv3zw-kqaaa-aaaap-aa27q-cai',
    'qekxn-6yaaa-aaaap-aa5bq-cai',
    'r6vtw-7iaaa-aaaap-aaoma-cai',
    'n5yqx-uqaaa-aaaap-aatja-cai',
    'ft6xr-taaaa-aaaam-aafmq-cai',
    '7hbq5-xyaaa-aaaah-abxsa-cai',
    'vupsp-fyaaa-aaaah-abjpq-cai',
    '4ibzi-eaaaa-aaaah-abqfa-cai',
    'fx5d3-ayaaa-aaaap-aakgq-cai',
    'gkhkc-5yaaa-aaaah-abvoa-cai',
    'w3tmp-uiaaa-aaaap-aawea-cai',
    'swu4x-biaaa-aaaap-aaj3q-cai',
    '6enz3-daaaa-aaaah-abxuq-cai',
    'nn6cu-rqaaa-aaaap-aa7ga-cai',
    'utve7-eaaaa-aaaah-abouq-cai',
    'goncb-kqaaa-aaaap-aakpa-cai',
    'gappj-raaaa-aaaap-aakoa-cai',
    'c7y4k-oqaaa-aaaap-aakxa-cai',
    '4roda-taaaa-aaaap-aa3sq-cai',
    '6dm7p-oyaaa-aaaah-abxua-cai',
    'pkhyd-piaaa-aaaap-aal7q-cai',
    'q6ods-tiaaa-aaaap-aajxq-cai',
    'fab4i-diaaa-aaaah-acr2q-cai',
    'nwyv2-gaaaa-aaaaj-arc2a-cai',
    'v6rdg-paaaa-aaaap-aajka-cai',
    'amrli-aiaaa-aaaap-aav4a-cai',
    'kafas-uaaaa-aaaao-aaofq-cai',
    'e7jp7-aqaaa-aaaah-acr6a-cai',
    '2bcjs-tiaaa-aaaap-aa3ha-cai',
    '335nj-syaaa-aaaap-aaikq-cai',
    '5lnqo-qyaaa-aaaah-abqdq-cai',
    '33lzl-uyaaa-aaaap-aaxpa-cai',
    '27qc3-lyaaa-aaaap-aaimq-cai',
    'fioai-paaaa-aaaap-aanzq-cai',
    'ke2v7-iqaaa-aaaap-aalda-cai',
    '4pa74-jyaaa-aaaah-abqfq-cai',
    'seyiz-jqaaa-aaaah-abobq-cai',
    'gq7ji-saaaa-aaaap-aazeq-cai',
    'unzmm-zyaaa-aaaap-abagq-cai',
    'm7vrl-xaaaa-aaaap-aah3a-cai',
    'drbbg-zaaaa-aaaap-aannq-cai',
    'johir-5iaaa-aaaah-abyea-cai',
    'gw7hg-iqaaa-aaaap-aanqq-cai',
    'ut7hi-aiaaa-aaaap-aajnq-cai',
    'uyk5m-zqaaa-aaaap-aa2fq-cai',
    'qqmo2-iyaaa-aaaap-aajwq-cai',
    'd26yv-eqaaa-aaaah-abz4q-cai',
    'xarx3-ayaaa-aaaah-abjbq-cai',
    'vjadt-byaaa-aaaap-aa2aa-cai',
    'vsf7w-3aaaa-aaaap-aa2cq-cai',
    's5eo5-gqaaa-aaaag-qa3za-cai',
    'xd2zm-2iaaa-aaaap-aawaa-cai',
    'ktlvk-giaaa-aaaap-aayja-cai',
    'xehin-vyaaa-aaaah-abo4a-cai',
    'jezzy-xqaaa-aaaap-aaybq-cai',
    'ah2fs-fqaaa-aaaak-aalya-cai',
    'xpegl-kaaaa-aaaah-abcrq-cai',
    'afeuw-qaaaa-aaaap-aakya-cai',
    'ff3uc-miaaa-aaaap-aakfq-cai',
    '53lcn-vyaaa-aaaah-ab4mq-cai',
    'nncvb-tyaaa-aaaah-abh2q-cai',
    'j3az4-4aaaa-aaaah-abyhq-cai',
    'tfitq-wqaaa-aaaap-aa2xq-cai',
    '2wf5f-3qaaa-aaaap-aaxiq-cai',
    'k6ucx-biaaa-aaaah-abyma-cai',
    'fjz4q-6iaaa-aaaap-aagiq-cai',
    'zicoj-2aaaa-aaaap-aaiea-cai',
    'o4mai-2yaaa-aaaap-aal2q-cai',
    'twfpe-jaaaa-aaaah-abjza-cai',
    'osona-biaaa-aaaap-aal3q-cai',
    'daqp5-niaaa-aaaap-aaktq-cai',
    'u44c2-mqaaa-aaaap-aa5ya-cai',
    'n46fk-6qaaa-aaaai-ackxa-cai',
    'pvimf-cyaaa-aaaah-abu4a-cai',
    '7aawj-2aaaa-aaaah-abxsq-cai',
    'lt2gz-oaaaa-aaaah-abylq-cai',
    'eze6x-xiaaa-aaaap-aan4a-cai',
    '6je2e-caaaa-aaaap-aaiua-cai',
    'ntmj5-jaaaa-aaaap-aamnq-cai',
    '2x763-hqaaa-aaaah-acupq-cai',
    'qca2u-aaaaa-aaaah-abomq-cai',
    'wakh7-myaaa-aaaah-abo2a-cai',
    'v5mzt-tqaaa-aaaah-abjoa-cai',
    'pvu3q-aqaaa-aaaap-aamaq-cai',
    'svjgc-5yaaa-aaaah-abj7q-cai',
    'cr2rc-vaaaa-aaaap-aakwa-cai',
    'lovxf-kaaaa-aaaap-aalea-cai',
    '4wuoq-vqaaa-aaaah-acmbq-cai',
    'mfhqa-iyaaa-aaaai-abona-cai',
    'slzze-ciaaa-aaaah-aa7ra-cai',
    'vqtoo-uqaaa-aaaap-aajla-cai',
    'bgi5q-eyaaa-aaaap-aak6q-cai',
    'xkpgs-kaaaa-aaaap-aajea-cai',
    '4uzum-riaaa-aaaap-aai3q-cai',
    'xizxk-fqaaa-aaaap-aa2nq-cai',
    'ahos3-5yaaa-aaaah-abbna-cai',
    '2duyk-4yaaa-aaaap-aaioq-cai',
    'xzrh4-zyaaa-aaaaj-qagaa-cai',
    'zthsm-ayaaa-aaaap-aaigq-cai',
    'q5fnf-jyaaa-aaaah-abwwa-cai',
    'ebkmf-xaaaa-aaaah-abs7a-cai',
]);

const start = ref(0);
const end = ref(0);
const done = ref(0);
const data = ref<
    {
        canister_id: string;
        start: number;
        end: number;
        own: number;
    }[]
>([]);

watch(
    () => [props.creator, props.cached],
    () => {
        console.error('creator', props.creator, props.cached);
        show.value = false;
        nextTick(() => (show.value = true));
        start.value = 0;
        end.value = 0;
        done.value = 0;
        data.value = [];
    },
    { immediate: true },
);

const now = () => new Date().getTime();

watch(
    () => show.value,
    (nv) => {
        if (!nv) return;
        if (!props.creator) return;
        // 重新获取数据
        start.value = now();
        end.value = 0;
        done.value = 0;
        let i = 0;
        while (i < canisters.value.length) {
            const index = i;
            data.value[index] = {
                canister_id: canisters.value[index],
                start: now(),
                end: 0,
                own: -1,
            };
            props.creator(idlFactoryNft, canisters.value[index]).then((actor: _SERVICE_NFT) => {
                //
                actor
                    .tokens_ext('814c957cb73858790bf546ab5f0477c029545216c39e61efe45226e5a7db4ba7')
                    .then((d: any) => {
                        if (d.ok) {
                            data.value[index].own = d.ok.length;
                            console.error('tokens_ext', canisters.value[index], d);
                        } else {
                            if (d.err.Other === 'No tokens') {
                                data.value[index].own = 0;
                            } else {
                                data.value[index].own = 999;
                            }
                        }
                    })
                    .finally(() => {
                        done.value += 1;
                        data.value[index].end = now();
                    });
            });
            i++;
        }
    },
);
watch(
    () => done.value,
    () => {
        if (done.value === canisters.value.length) {
            end.value = now();
        }
    },
);
</script>

<template>
    <div v-if="show && props.creator && start !== 0">
        <div>{{ `总计时: ${done === canisters.length ? `${end - start}ms` : '未结束'}` }}</div>
        <table>
            <tr>
                <th>罐子</th>
                <th>数量</th>
                <th>耗时</th>
            </tr>
            <tr v-for="d in data" :key="d.canister_id">
                <td>{{ d.canister_id }}</td>
                <td>{{ d.own < 0 ? '-' : d.own }}</td>
                <td>{{ d.end > 0 ? `${d.end - d.start}ms` : '-' }}</td>
            </tr>
        </table>
    </div>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
