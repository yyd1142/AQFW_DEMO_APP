<template>
    <div class="InputDeviceValue">
        <div class="placeholder-item"></div>
        <mko-header title="压力指示装置" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <div class="input-field">
                <span class="key">压力数值</span>
                <input class="input" placeholder="请输入压力数值" type="text" :value="text" @input="addDataValue" />
                <i class="icon icon-clear-text" @click.stop="clearText" v-if="text" />
            </div>
        </div>
    </div>
</template>

<script>
import * as types from 'store/mutation-types'
export default {
    data() {
        return {
            text: ''
        }
    },
    deactivated() {
        this.text = ''
    },
    methods: {
        back() {
            this.$MKOPop()
        },
        clearText() {
            this.text = ''
        },
        addDataValue(e) {
            let index = this.$route.query.deviceDatasIndex
            let dataValue = e.target.value
            this.$store.commit(types.DAILYXUNCHA_DEVICERESULT_ADD_DATAVALUE, { index, dataValue })
            sessionStorage.setItem(`hasInputDataValue_${this.$route.query.positionId}_${this.$route.query.deviceId}`, JSON.stringify({
                index: index, 
                dataValue: dataValue
            }))
        }
    }
}
</script>

<style lang="less">
@import "../../../../config.less";
.InputDeviceValue {
    .input-field {
        width: 100%;
        line-height: 44px;
        height: 44px;
        background-color: #ffffff;
        padding: 0 14px;
        position: relative;
        .key {
            font-size: 16px;
            color: #565656;
            letter-spacing: 0px;
            position: absolute;
            left: 14px;
            top: 0;
        }
        .input {
            border-style: none;
            height: 40px;
            width: 100%;
            padding-left: 100px;
            float: left;
            font-size: 14px;
            color: #333333;
        }
        .icon {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 14px;
            margin: auto;
        }
    }
}
</style>
