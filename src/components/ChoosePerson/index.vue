<template>
    <div class="ChoosePerson">
        <div class="placeholder-item"></div>
        <mko-search-bar v-model="searchValue" is-header autofocus @onCancel="cancel">
        </mko-search-bar>
        <div class="page-wrap">
            <div class="search-bar-wrap">
                <ul class="person-table-view">
                    <li class="person-table-cell" v-for="item, index in (searchValue ? searchDatas : persons)" @click="choose(item, index)">
                        <div class="padding">
                            <i class="icon" :class="item.checked ? 'icon-is-checked' : 'icon-no-checked'"></i>
                            <span class="name">{{item.name}}</span>
                            <span class="role">安全员</span>
                        </div>
                    </li>
                </ul>
            </div>
            <no-data v-if="searchValue ? (searchDatas.length == 0) : (persons.length == 0) "></no-data>
            <div class="xuncha-btn" @click.stop="submit">
                <span>完成({{chooseResults.length}})</span>
            </div>
        </div>
    </div>
</template>
<script>
    import {SearchBar, NoData} from 'components'
    import {Toast} from 'mint-ui'
    export default {
        data() {
            return {
                searchValue: '',
                chooseResults: [],
                searchDatas: [],
                persons: [{
                    name: '王慧农', role: 1, checked: false
                }, {
                    name: '刘荣志', role: 1, checked: false
                }, {
                    name: '纪志龙', role: 1, checked: false
                }, {
                    name: '范章顺', role: 1, checked: false
                }, {
                    name: '杨端午', role: 1, checked: false
                }, {
                    name: '余燕瑜', role: 1, checked: false
                }, {
                    name: '朱扬墩', role: 1, checked: false
                }]
            }
        },
        watch: {
            searchValue: function () {
                this.searchData();
            }
        },
        activated() {
            this.setBackButton()
        },
        deactivated() {
            this.persons.map(item => {
                return item.checked = false;
            });
            this.persons.map(item => {
                return item.checked = false;
            });
            this.chooseResults = [];
            this.searchValue = '';
        },
        methods: {
            back() {
                this.$MKOPop();
            },
            cancel() {
                this.back();
            },
            searchData() {
                let search = this.searchValue;
                if(search) {
                    this.searchDatas = this.persons.filter(item => {
                        return item.name.indexOf(search) > -1;
                    })
                }
            },
            listenInput(val) {

            },
            closeSearchBar() {

            },
            clearSearch() {

            },
            choose(item, index) {
                if (!item.checked) {
                    this.chooseResults.push(item);
                } else {
                    let datas = []
                    for (let i = 0; i < this.chooseResults.length; i++) {
                        if (this.chooseResults[i].name != item.name) {
                            datas.push(this.chooseResults[i]);
                        }
                    }
                    this.chooseResults = datas;
                }
                this.persons[index].checked = !item.checked;
            },
            submit() {
                if(this.$route.query.from === 'monitorVideo') {
                    let json = JSON.parse(sessionStorage.getItem('videoDeviceDatas'));
                    for(let [index, item] of json.deviceAlarmDatas.entries()) {
                        if(item.id === this.$route.params.id) {
                            json.deviceAlarmDatas.splice(index, 1);
                        }
                    }
                    for(let [index, item] of json.deviceMonitorDatas.entries()) {
                        if(item.id === this.$route.params.id) {
                            item.status = 3;
                        }
                    }
                    sessionStorage.setItem('videoDeviceDatas', JSON.stringify(json));
                }
                Toast({message: "已通知相应负责人", duration: 2000});
                setTimeout(() => {
                    this.$MKOPop(2);
                }, 1500);
            },
            setBackButton() {
                let self = this;
                window.mkoBackButton = {}
                window.mkoBackButton.bInputData = true
                window.mkoBackButton.callback = function () {
                    window.mkoBackButton.bInputData = false;
                    self.cancel();
                }
            }
        },
        components: {
            SearchBar, NoData
        }
    }
</script>
<style lang="less">
    @import "../../config.less";

    .ChoosePerson {
        .search-bar-wrap {
            position: fixed;
            z-index: 20;
            margin: auto;
            height: 100%;
            width: 100%;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            .search-hidden-wrap {
                position: fixed;
                z-index: 20;
                margin: auto;
                height: 100%;
                width: 100%;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
            }
            .search-wrap {
                position: fixed;
                height: 44px;
                padding: 8px;
                background: #C9C9CE;
                z-index: 22;
                width: 100%;
                top: 44px + @headerTop;
                box-shadow: 0px 2px 6px 0px rgba(213, 213, 213, 0.50);
            }
        }
        .person-table-view {
            width: 100%;
            background-color: #ffffff;
            margin-top: 44px;
            .person-table-cell {
                width: 100%;
                box-sizing: border-box;
                padding-left: 14px;
                background-color: #ffffff;
                height: 44px;
                .padding {
                    .border-btm(@borderGray);
                    .icon {
                        position: absolute;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        margin: auto;
                    }
                    .name {
                        width: 100%;
                        font-size: 14px;
                        line-height: 44px;
                        padding-left: 34px;
                    }
                    .role {
                        font-size: 14px;
                        float: right;
                        height: 44px;
                        line-height: 44px;
                        padding-right: 14px;
                    }
                }
            }
        }
        .xuncha-btn {
            height: 50px;
            width: 100%;
            display: table;
            background: #3399ff;
            position: fixed;
            bottom: 0;
            z-index: 24;
            &.end {
                background: #ff6666;
            }
            &.disabled {
                background: #cccccc;
            }
            span {
                font-size: 16px;
                color: #ffffff;
                letter-spacing: 0px;
                width: 100%;
                height: 50px;
                line-height: 50px;
                vertical-align: middle;
                display: table-cell;
                text-align: center;
            }
        }
    }
</style>
