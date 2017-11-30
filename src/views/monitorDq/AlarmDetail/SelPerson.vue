<template>
    <div class="dq-alarm-sel-person-wrap">
        <mko-search-bar v-model="searchValue" is-header hint-text="搜索责任人名称">
            <div slot="right-button" class="back-button fr text-middle" @click="back">取消</div>
        </mko-search-bar>
        <div class="page-wrap">
            <mko-cell :title="p.name" val="安全员" main="left" @click="selPerson(p)" v-for="p in list">
                <mko-check-box slot="icon" :active="p.sel" @click="selPerson(p)"></mko-check-box>
            </mko-cell>
        </div>
        <div class="button-wrap">
            <mko-button size="large" no-radius @click="send">完成({{formData.length}})</mko-button>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                searchValue: '',
                list: [
                    {id: 1, name: '张薯条', role: 1, sel: false},
                    {id: 2, name: '陈炸鸡', role: 1, sel: false},
                    {id: 3, name: '孔年糕', role: 1, sel: false},
                    {id: 4, name: '邓烤肉', role: 1, sel: false},
                    {id: 5, name: '吕三文鱼', role: 1, sel: false},
                ],
                formData: []
            }
        },
        watch: {
            searchValue: function () {
                this.searchData();
            }
        },
        computed: {},
        mounted() {
        },
        activated(){
            this.formData = []
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            searchData() {

            },
            selPerson(item){
                for (let i = 0; i < this.formData.length; i++) {
                    if (this.formData[i].id == item.id) {
                        this.formData.splice(i, 1);
                        item.sel = false;
                        return;
                    }
                }
                this.formData.push(item);
                item.sel = true;
            },
            send(){
                this.$MKODialog({
                    msg: '已通知相关责任人'
                }).then(res => {
                    this.back();
                })
            },
            back(){
                this.$MKOPop();
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .dq-alarm-sel-person-wrap {
        .back-button {
            color: #fff;
        }
        .button-wrap {
            position: fixed;
            bottom: 0;
            width: 100%;
        }
    }
</style>
