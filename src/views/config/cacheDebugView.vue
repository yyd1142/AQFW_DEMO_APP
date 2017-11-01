<template>
    <div>
        <mko-header title="设置" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap config-page-wrap">
            <div v-for="key in keys" class="cell-wrap" @click="showValue(key)">
                <mt-cell :title="key"></mt-cell>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                keys: []
            }
        },
        mounted() {
            this.keys = Object.keys(localStorage);
        },
        methods: {
            showValue(key) {
                let value = localStorage.getItem(key);
                this.$MKODialog({msg: value});
            },
            back() {
                this.$MKOPop()
            }
        }
    }
</script>
