<template>
    <div class="mko-select-box">
        <div class="sel-header" v-if="title">
            <div class="title fl">{{title}}</div>
            <div class="value fr" v-if="showValue||showValue===''">{{values}}</div>
        </div>
        <div class="sel-body">
            <button class="sel-btn no-overflow"
                    :class="{'is-disabled':item.disabled,'active':actFn(item[valueKey||'value'])}"
                    :style="{margin:btnMargin,width:btnWidth}"
                    @click="selOption(item)"
                    v-for="item in options">
                <!--<span class="icon-tick-blue-2"></span>-->
                {{item[nameKey || 'text']}}
            </button>
            <slot name="more"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {},
            showValue: {},
            options: {type: Array, required: true, default: []},
            selected: {type: Array, required: true, default: []},//selected既可以是普通数组，也可以是对象数组
            column: {type: Number, default: 4},
            nameKey: {}, valueKey: {},
        },
        data () {
            return {
                values: '',
            }
        },
        watch: {
            selected(arr){
                let op = this.options;
                let val = [];
                op.forEach(item => {
                    for (let cell of arr) {
                        let ck = (cell[this.valueKey || 'value'] || cell[this.valueKey || 'value'] === 0) ? cell[this.valueKey || 'value'] : cell;
                        if (ck == item[this.valueKey || 'value']) {
                            val.push(item[this.nameKey || 'text']);
                            break;
                        }
                    }
                });
                this.values = val.join(',')
            },
        },
        computed: {
            btnMargin(){
                let c = parseInt(this.column) || 4;
                if (c == 1) {
                    return `3px 0`
                } else {
                    return `5px 1.4%`;
                }
            },
            btnWidth(){
                let c = parseInt(this.column) || 4;
                if (c == 1) {
                    return `100%`
                } else {
                    return `${((100 / c) * (1 - 0.014 * c * 2)).toFixed(2)}%`;
                }
            }
        },
        mounted() {
        },
        activated(){
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            actFn(val){
                let sel = this.selected;
                for (let item of sel) {
                    let ck = (item[this.valueKey || 'value'] || item[this.valueKey || 'value'] === 0) ? item[this.valueKey || 'value'] : item;
                    if (ck == val)
                        return true;
                }
            },
            selOption(item){
                this.$emit('select', item)
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .mko-select-box {
        padding: 9px 9px 0 9px;
        .sel-header {
            padding: 5px 1.4%;
            height: 22px;
            line-height: 12px;
            font-size: 12px;
            color: @baseText02;
            .title {

            }
        }
        .sel-body {
            position: relative;
            margin: 0 auto;
            max-width: 414px;
            &:after {
                content: '';
                display: block;
                clear: both;
            }
            .sel-btn {
                display: block;
                float: left;
                margin: 5px 1.4%;
                height: 30px;
                border: 0;
                border-radius: 4px;
                outline: none;
                letter-spacing: 0;
                font-size: 12px;
                background-color: @baseBG01;
                color: @baseText01;
                &.active {
                    background-color: fade(@mainBlue, 10%);
                    color: @mainBlue;
                }
                &.is-disabled {
                    border: 1px solid @baseBorder;
                    color: #E0E3E7;
                }
            }
        }
    }
</style>
