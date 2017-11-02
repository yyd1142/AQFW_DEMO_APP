<template>
    <div class="ChoosePerson">
        <div class="placeholder-item"></div>
        <mko-header title="选择通知人" left-icon="icon-back" @handleLeftClick="back" :right-icon-text="'完成(' + chooseResults.length + ')'" @handleRightClick="submit"></mko-header>
        <div class="page-wrap">
            <div class="search-bar-wrap">
                <search-bar v-model="searchValue" @onFocus="listenInput" @onCancelSearch="closeSearchBar"
                            @onClearSearch="clearSearch"></search-bar>
                <ul class="person-table-view">
                    <li class="person-table-cell" v-for="item, index in persons" @click="choose(item, index)">
                        <div class="padding">
                            <i class="icon" :class="item.checked ? 'icon-is-checked' : 'icon-no-checked'"></i>
                            <span class="name">{{item.name}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import {SearchBar} from 'components';
    export default {
        data() {
            return {
                searchValue: '',
                persons: [{
                    name: '杨子康1', checked: false
                }, {
                    name: '杨子康2', checked: false
                }, {
                    name: '杨子康3', checked: false
                }, {
                    name: '杨子康4', checked: false
                }, {
                    name: '杨子康5', checked: false
                }, {
                    name: '杨子康6', checked: false
                }, {
                    name: '杨子康7', checked: false
                }],
                chooseResults: []
            }
        },
        watch: {
            searchValue: function () {
                this.searchData();
            }
        },
        methods: {
            back() {
                this.$MKOPop();
            },
            searchData() {

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
                    for(let i = 0; i < this.chooseResults.length; i++) {
                        if(this.chooseResults[i].name != item.name) {
                            datas.push(this.chooseResults[i]);
                        }
                    }
                    this.chooseResults = datas;
                }

                this.persons[index].checked = !item.checked;
            },
            submit() {
                this.$MKOPop()
            }
        },
        components: {
            SearchBar
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
            margin-top: 88px + @headerTop;
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
                }
            }
        }
    }
</style>
