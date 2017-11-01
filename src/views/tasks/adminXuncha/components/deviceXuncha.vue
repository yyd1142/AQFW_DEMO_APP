<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="巡查" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <xuncha-status></xuncha-status>
            <ul class="xcop-table-views">
                <li class="xcop-table-cell" :class="item.needInputData == 1 ? 'inputdata-table-cell' : null"  v-for="(item, index) in checkRules">
                    <div class="xcop-wrap">
                        <i class="icon iconfont icon-prompt xcop-icon" :class="item.value ? 'inputdata-icon' : 'font-red'"  v-if="item.needInputData == 1" @click="open(item, index)">
                                </i>
                        <i class="icon iconfont" :class="item.show ? 'icon-xiangshangjiantou xcop-icon-ed' : 'icon-xiangxiajiantou xcop-icon'" @click="open(item, index)" v-else>
                                </i>
                        <span class="item" v-text="item.content"></span>
                        <div @click="switchOpen(index, item.content)">
                            <xuncha-switch ref="switchChild" class="xc-switch" :value="item.value"></xuncha-switch>
                        </div>
                        <span class="yh-fuhe-item great" :class="item.value ? 'great' : 'font-red'" v-text="item.value ? item.conclusionYes : item.conclusionNo"></span>
                    </div>
                    <div class="xcop-wrap"  v-if="item.needInputData == 1">
                        <i class="icon iconfont icon-prompt xcop-icon" :class="item.value ? 'inputdata-icon' : 'font-red'">
                            </i>
                        <span class="item">请输入{{item.dataName}}</span>
                        <input class="xcop-input" type="number" :placeholder="`${item.dataName}`">
                    </div>
                    <transition name="fade">
                        <div class="xcop-item"  v-if="!item.value">
                            <textarea class="xcop-textarea" placeholder="描述..."></textarea>
                            <div class="xcop-photo-view">
                                <div class="xcop-photo-cell"  v-for="(obj, index) in item.url">
                                    <span class="xcop-photo-item">
                                            <img src="/static/1.jpg" />
                                        </span>
                                </div>
                                <div class="xcop-photo-cell" @click="upload(index)">
                                    <span class="xcop-photo-item">
                                            <img src="/static/plus.png" />
                                        </span>
                                </div>
                            </div>
                        </div>
                    </transition>
                </li>
            </ul>
            <div @click="submit()">
                <mt-button type="primary" size="large" class="btn-primary bottom-btn">确认</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    import xunchaStatus from '../../../components/xunchaStatusNavbar/xunchaStatus.vue';
    import xunchaSwitch from '../../../components/xunchaSwitch/switch.vue';
    import api from 'api'
    
    export default {
        data() {
            return {
                checkRules: {}
            }
        },
        mounted() {
            api.getXCTaskDeviceCheckRulesByUnitId({
                unitId: 51
            }).then(res => {
                let tmpValues = [];
                for (let v of res.response) {
                    tmpValues.push({
                        value: true,
                        content: v.content,
                        conclusionYes: v.conclusionYes,
                        conclusionNo: v.conclusionNo,
                        needInputData: v.needInputData,
                        dataName: v.dataName ? v.dataName : '',
                        show: false
                    })
                }
                this.checkRules = tmpValues;
            })
        },
        methods: {
            back() {
                this.$MKOPop();
            },
            open(item, index) {
                if (!this.checkRules[index].value) {
                    this.checkRules[index].show = true;
                }
            },
            switchOpen(index, value) {
                this.checkRules[index].value = !this.checkRules[index].value;
            },
            upload(index) {
                this.checkRules[index].url = [1, 2, 3];
            },
            submit() {
                this.$emit('submitEvent');
            }
        },
        components: {
            xunchaSwitch,
            xunchaStatus
        }
    }
</script>

<style lang="less" src="./../xuncha.less" scoped>
    
</style>