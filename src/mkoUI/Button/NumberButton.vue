<template>
    <div class="mko-number-button clear">
        <div class="icon-circle-minus fl" @click="minus"></div>
        <input class="ipt fl" type="number" v-model="val"
               @keyup="correctVal" @beforepaste="correctVal">
        <div class="icon-circle-plus fl" @click="plus"></div>
    </div>
</template>

<script>
    export default {
        props: ['value', 'min', 'max'],
        data () {
            return {
                val: 0
            }
        },
        watch: {
            value(val){
                this.val = val;
            },
            val(val){
//                this.correctVal();
                this.val = parseInt(val);
                this.$emit('input', parseInt(val));
            }
        },
        computed: {},
        mounted() {
            if (this.value)
                this.val = this.value;
        },
        activated(){
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            correctVal(){
                if (this.min || this.min === 0) {
                    if (parseInt(this.val) < this.min)
                        this.val = this.min;
                }
                if (this.max || this.max === 0) {
                    if (parseInt(this.val) > this.max)
                        this.val = this.max;
                }
            },
            minus(){
                if (this.min || this.min === 0) {
                    if (this.val > this.min)
                        this.val--;
                } else {
                    this.val--;
                }
            },
            plus(){
                if (this.max || this.max === 0) {
                    if (this.val < this.max)
                        this.val++;
                } else {
                    this.val++;
                }
            },
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .mko-number-button {

        .btn {
            width: 22px;
            height: 22px;
            line-height: 16px;
            border-radius: 50%;
            border: 2px solid @mainBlue;
            font-size: 18px;
            text-align: center;
            &.minus {
                color: @mainBlue;
            }
            &.plus {
                color: #fff;
                background-color: @mainBlue;
            }
        }

        .ipt {
            width: 44px;
            height: 22px;
            border: none;
            margin: 0 8px;
            font-size: 14px;
            line-height: 14px;
            letter-spacing: 0;
            text-align: center;
            color: @baseText01;
        }
    }
</style>
