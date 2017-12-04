<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.title" left-icon="icon-back" @handleLeftClick="back" right-icon-text="编辑" @handleRightClick="edit"></mko-header>
        <div class="page-wrap dw-data-wrap">
            <div class="com-data-wrap">
                <mko-cell title="单位名称" :val="zrdwItem.dwName" non-text="暂无"></mko-cell>
                <mko-cell title="联系人" :val="zrdwItem.dwContact" non-text="暂无"></mko-cell>
                <mko-cell title="联系电话" :val="zrdwItem.dwPhone" non-text="暂无"></mko-cell>
                <mko-cell title="合同签订日期" :val="zrdwItem.contractDate" non-text="未知"></mko-cell>
                <mko-cell title="合同起止日期"
                          :val="(zrdwItem.contractStartDate+zrdwItem.contractEndDate)?(zrdwItem.contractStartDate||'未知') + '至' + (zrdwItem.contractEndDate||'未知'):'未知'" non-text="暂无"></mko-cell>

                <mko-cell title="下载文件" :val="item.filename" active @click="downloadFile(item)" v-for="item in files"></mko-cell>
            </div>
            <!-- <div class="deleted-wrap">
              <mt-button class="deleted-btn" type="danger" size="large" @click="deleted()">删除</mt-button>
            </div> -->
        </div>
    </div>
</template>

<!--<style lang="less" src="./index.less"></style>-->

<script>
    import moment from 'moment'
    import api from 'api'
    import apiconf from 'apiconf'
    import { Toast } from 'mint-ui'
    var _id = '';
    export default {
        data() {
            return {
                notData: false,
                zrdwItem: {},
                files: []
            }
        },
        activated() {
            this.getDWInfo()
        },
        methods: {
            getDWInfo() {
                this.files = []
                let params = {
                    m: 'info',
                    id: this.$route.params.pid
                }
                api.getZRDWInfo(params).then(result => {
                    if (result.code === 0) {
                        let not_date = 'Invalid date';
                        this.zrdwItem = result.response;
                        this.zrdwItem.contractDate = moment(this.zrdwItem.contractDate).format("YYYY-MM-DD") == not_date ? '' : moment(this.zrdwItem.contractDate).format("YYYY-MM-DD");
                        this.zrdwItem.contractStartDate = moment(this.zrdwItem.contractStartDate).format("YYYY-MM-DD") == not_date ? '' : moment(this.zrdwItem.contractStartDate).format("YYYY-MM-DD");
                        this.zrdwItem.contractEndDate = moment(this.zrdwItem.contractEndDate).format("YYYY-MM-DD") == not_date ? '' : moment(this.zrdwItem.contractEndDate).format("YYYY-MM-DD");
                        if (result.response.attachmentID != null && result.response.attachmentID != '') {
                            this.getFiles(result.response.attachmentID)
                        }
                    }
                });
            },
            back() {
                this.$MKOPop()
            },
            getFiles(id) {
                api.getByPath(`/info/${id}`)({}).then(res => {
                    if (res.code != 0)
                        return;
                    if (res.response && res.response.length > 0) {
                        for (let i = 0; i < res.response.length; i++) {
                            let item = res.response[i]
                            this.files.push({
                                url: `${apiconf.resourcesDomain}/${item.resouceId}`,
                                filename: `${item.title}.${item.type}`
                            })
                        }

                    }
                });
            },
            downloadFile(item) {
                this.$MKOJumpOutsideURL(item.url)
            },
            edit() {
                this.$MKOPush({
                    name: 'editXFZRUnit',
                    query: {
                        zrdwItem: this.zrdwItem,
                        title: this.$route.query.title
                    }
                })
            },
            deleted() {
                this.$MKODialog({
                    title: '提示',
                    msg: '此操作将永久删除该条数据, 是否继续',
                    cancelBtn: true,
                }).then(action => {
                    if (action === 'confirm') {
                        api.removeZRDWUnit({
                            m: 'remove',
                            id: this.zrdwItem.id
                        }).then(response => {
                            if (!response) return false;
                            if (response.code == 0) {
                                Toast({
                                    message: '删除成功',
                                    position: 'middle',
                                    duration: 1500
                                });
                                setTimeout(() => {
                                    this.back();
                                }, 1500);
                            } else {
                                Toast({
                                    message: '删除失败',
                                    position: 'middle',
                                    duration: 1500
                                });
                            }
                        })
                    }
                });
            }
        }
    }
</script>
