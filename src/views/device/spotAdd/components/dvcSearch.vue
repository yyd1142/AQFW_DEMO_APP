<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-search-bar v-model="val" hint-text="请输入设备名称" is-header autofocus @onCancel="back"></mko-search-bar>
        <div class="dvc-search-wrap">
            <mko-cell class="hint" :title="`搜索「${val}」`" main="left" v-show="hasVal"></mko-cell>
            <mko-cell :title="item.unitName" icon="icon-search-gray" @click="selDvc(item)" v-for="item in hintList"></mko-cell>
        </div>
    </div>
</template>

<script>
    import api from 'api'

    export default {
        props: ['type'],
        data () {
            return {
                val: '',
                hasVal: false,
                hintList: []
            }
        },
        watch: {
            val(val){
                if (val) {
                    this.hasVal = true;
                    this.getHintList(val);
                } else {
                    this.hasVal = false;
                    this.hintList = [];
                }
            }
        },
        computed: {},
        mounted() {
            this.setBackButton();
        },
        activated(){
        },
        deactivated() {
        },
        destroyed(){
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
        },
        methods: {
            getHintList(val){
                let params = {
                    unitName: val,
                    dep: this.type
                };
                api.searchDvc(params).then(res => {
                    if (res && res.code == 0) {
                        this.hintList = res.response;
                    }
                });

            },
            selDvc(item){
                this.$emit('sel', item)
            },
            setBackButton() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                if (window.mkoBackButton.bInputData) {
                    window.mkoBackButton.callback = this.back;
                }
            },
            back(){
                this.$emit('back')
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../../config.less";

    .xc-spot-add-dvc-wrap .dvc-search-wrap {
        position: fixed;
        top: @headerHeight+@headerTop;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 30;
        background-color: #fff;
        .mko-basic-cell {
            padding-left: 12px;
            .title {
                font-size: 14px;
            }
            &.hint {
                padding-left: 38px;
                .title {
                    color: @mainBlue;
                }
            }
            &:last-child .cell {
                box-shadow: 0 1px 0 0 @baseBorder;
            }
        }
    }
</style>
