<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
    <div class="header">
        <select>
            <option value="II">II</option>
        </select>
    </div>
    <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style lang="less" scoped>
.header {
    > select {
        width: 500px;
        height: 28px;
    }
}
</style>
