<template>
    <div>
        <!--<loading v-show="loading"></loading>-->
        <div class="placeholder-item"></div>
        <mko-header title="安全活动" left-icon="icon-back" right-icon-text="刷新" @handleLeftClick="back" @handleRightClick="refresh"></mko-header>
        <div class="page-wrap">
            <ul class="safe-table-view">
                <li class="safe-table-cell"  v-for="(item, index) in files" v-if="index != 0" @click="goSafeActivity(item)">
                    <div class="title">{{projectName[item.project]}}</div>
                    <div class="item">{{item.description}}</div>
                    <div class="item">上传时间：{{item.uploadDate | formatDate}}</div>
                    <div class="badge" :class="item.badgeBG">
                        <span>{{item.status}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import api from "api"
import { formatDate } from 'filters'
import { Loading } from 'components'
import { Indicator, Toast } from 'mint-ui'
var updateDatas = [];
var needUpdate = true;
var _groupId = ''
export default {
    data() {
        return {
            projectName: ['', '消防安全制度', '消防队管理（专职、义务）', '消防工作计划', '消防工作例会', '消防安全宣传教育与培训', '灭火、应急疏散预案', '演练'],
            files: [],
            loading: true,
            notData: false
        }
    },
    created() {
        for (let i = 0; i < 8; i++) {
            this.files.push({
                "id": null,
                "groupId": null,
                "project": i,
                "description": "暂无",
                "startDate": null,
                "stopDate": null,
                "uploadDate": null,
                "projectFileID": "暂无",
                "status": '未开展',
                "badgeBG": "yellow"
            })
        }
    },
    activated() {
        this.$nextTick(() => {
            if (_groupId != this.$store.getters.groupId) {
                this.safeActivity();
            }
        })
    },
    methods: {
        safeActivity() {
            let today = new Date();
            let params = {
                m: 'info',
                groupId: this.$store.getters.groupId
            }
            api.getXFSafetyFilesList(params).then(result => {
                _groupId = this.$store.getters.groupId
                Indicator.close()
                if (result.code == 0) {
                    let datas = result.response;
                    if (datas.length > 0) {
                        this.files.forEach((i) => {
                            datas.forEach((j) => {
                                if (today < new Date(j.startDate)) {
                                    j.status = '未开展';
                                    j.badgeBG = "yellow"
                                } else if (today >= new Date(j.startDate) && today <= new Date(j.stopDate)) {
                                    j.status = '已开展'
                                    j.badgeBG = "green"
                                } else if (today > new Date(j.stopDate)) {
                                    j.status = '已超期'
                                    j.badgeBG = "red"
                                }
                                if (i.project == j.project) {
                                    this.files.splice(this.files.indexOf(i), 1, j)
                                }
                            })
                        })
                    }
                }
            })
        },
        goSafeActivity(item) {
            if (item.status == '已超期') {
                Toast({
                    message: '请去WEB端更新文件',
                    position: 'middle',
                    duration: 1500
                });
                return false;
            }
            if (item.status == '未开展') {
                Toast({
                    message: '请去WEB端上传文件',
                    position: 'middle',
                    duration: 1500
                });
                return false;
            }
            sessionStorage.setItem('SAFEACTIVITY_DATA', JSON.stringify(item));
            this.$MKOPush(`/safe_activity/${item.id}`)

        },
        back() {
            this.$MKOPop()
        },
        refresh() {
            Indicator.open({ spinnerType: 'fading-circle' });
            setTimeout(() => {
                let files = []
                for (let i = 0; i < 8; i++) {
                    files.push({
                        "id": null,
                        "groupId": null,
                        "project": i,
                        "description": "暂无",
                        "startDate": null,
                        "stopDate": null,
                        "uploadDate": null,
                        "projectFileID": "暂无",
                        "status": '未开展',
                        "badgeBG": "yellow"
                    })
                }
                this.files = files;
                this.safeActivity()
                Toast({
                    message: '刷新完成',
                    position: 'middle',
                    duration: 1500
                });
            }, 1500)
        }
    },
    components: {
        Loading
    }
}
</script>

<style lang="less" scoped>
@import "../../config.less";
.safe-table-view {
    box-sizing: border-box;
    width: 100%;
    padding-left: 14px;
    background-color: #ffffff;
    .safe-table-cell {
        width: 100%;
        height: 70px;
        padding: 6px 14px 6px 0;
        background-color: #ffffff;
        position: relative;
        box-sizing: border-box;
        .border-btm(@borderColor);
        .title {
            font-size: 14px;
            color: #232323;
        }
        .item {
            width: 78%;
            font-size: 12px;
            color: #606060;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .badge {
            width: 50px;
            position: absolute;
            display: table;
            top: 0;
            bottom: 0;
            right: 14px;
            margin: auto;
            border-radius: 2px;
            span {
                display: table-cell;
                vertical-align: middle;
                font-size: 12px;
                color: #ffffff;
                text-align: center;
                line-height: 20px;
                height: 20px;
            }
        }
        .green {
            background-color: #00E460;
        }
        .yellow {
            background-color: #FFB224;
        }
        .red {
            background-color: #FF6B41;
        }
    }
}

.not-sa-data {
    margin-top: 40px;
}
</style>