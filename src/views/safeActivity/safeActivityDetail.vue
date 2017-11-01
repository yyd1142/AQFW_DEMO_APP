<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="projectName[fileItem.project]" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <div class="activity-item">
                <div class="left">
                    <span>上传日期</span>
                </div>
                <div class="right">
                    <span>{{fileItem.uploadDate | formatDate}}</span>
                </div>
            </div>
            <div class="zhidu-wrap">
                <div class="files-table-view"  v-for="item in files" @click="downloadFile(item)">
                    <div class="title">
                        <span v-if="!item.photo">{{titleFilers(item.title)}}.{{item.type}}</span>
                        <img :src="item.photo" alt="" v-if="item.photo" height="90" width="90">
                    </div>
                    <div class="date">
                        <span>{{item.createTime | formatDate}}</span>
                    </div>
                </div>
            </div>
        </div>
        <photo-preview :img="photoItem.photo" v-model="showPhoto"></photo-preview>
    </div>
</template>

<script>
import api from 'api'
import apiconf from 'apiconf'
import { PhotoBox, PhotoPreview } from 'components';
import { formatDate } from 'filters'

export default {
    data() {
        return {
            projectName: ['', '消防安全制度', '消防队管理（专职、义务）', '消防工作计划', '消防工作例会', '消防安全宣传教育与培训', '灭火、应急疏散预案', '演练'],
            fileItem: {},
            files: [],
            photoItem: "",
            showPhoto: false
        }
    },
    activated() {
        this.showPhoto = false;
        if (sessionStorage.getItem('SAFEACTIVITY_DATA')) {
            this.files = []
            this.fileItem = JSON.parse(sessionStorage.getItem('SAFEACTIVITY_DATA'));
            api.getResourcesInfo(this.fileItem.projectFileID).then(result => {
                if (!result) return false;
                if (result.code == 0) {
                  this.files = result.response.map(item => {
                    let t = item.type.toLowerCase();
                    if (t == 'jpg' || t == 'jpeg' || t == 'bmp' || t == 'png') {
                      item.photo = `${apiconf.resourcesDomain}/${item.resouceId}`;
                    }
                    return item;
                  });
                } else {
                    this.hasData = false;
                }
            })
        } else {
            this.$MKOPop();
        }
    },
    methods: {
        back() {
            this.$MKOPop()
        },
        downloadFile(item) {
            if (item.photo) {
              this.photoItem = item;
              this.showPhoto = true;
              return;
            }
            this.$MKOJumpOutsideURL(`${apiconf.resourcesDomain}/${item.resouceId}`)
        },
        titleFilers(val) {
            let stringLength = val.length;
            if (stringLength >= 10) {
                val = `${val.substring(0, 10)}...`;
            }
            return val;
        },
    },
    components: {
      PhotoBox, PhotoPreview
    }
}
</script>

<style lang="less" scoped>
@import "../../config.less";
.activity-item {
    width: 100%;
    background-color: #ffffff;
    .border-btm(@borderColor);
    height: 44px;
    .left {
        float: left;
        padding-left: 14px;
        display: table;
        span {
            height: 44px;
            line-height: 44px;
            font-size: 14px;
            color: #232323;
            display: table-cell;
            vertical-align: middle;
        }
    }
    .right {
        float: right;
        margin-right: 14px;
        display: table;
        span {
            height: 44px;
            line-height: 44px;
            font-size: 14px;
            color: #606060;
            display: table-cell;
            vertical-align: middle;
        }
    }
}

.zhidu-wrap {
    margin: 14px 0 0 0;
    .files-table-view {
        width: 100%;
        background-color: #ffffff;
        padding: 0 14px;
        display: inline-flex;
        position: relative;
        .border-btm(@borderColor);
        .title {
            width: 60%;
            display: table;
            text-decoration: underline;
            span {
                font-size: 14px;
                color: #232323;
                display: table-cell;
                vertical-align: middle;
                height: 44px;
                line-height: 44px;
            }
        }
        .date {
            width: 40%;
            display: table;
            span {
                display: table-cell;
                vertical-align: middle;
                font-size: 14px;
                color: #606060;
                height: 44px;
                line-height: 44px;
                text-align: right;
            }
        }
    }
}
</style>
