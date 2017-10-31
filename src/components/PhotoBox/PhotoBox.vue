<template>
    <div>
        <div class="photo-wrap">
            <div class="photo-table" id="photoWrapper" :style="{height:  (photoList.length + (readOnly ? 0 : 1) <= 4 ? (photoWrapperHeight + 24) : (photoWrapperHeight * 2) + 36) + 'px'}">
                <div class="photo-cell" :class="'photo-cell-' + index" v-for="(url, index) in photoList" @click="show(url, index)" :style="{ width: photoWrapperHeight + 'px', height: photoWrapperHeight + 'px' }">
                    <span :style="{ background: 'url('+ url +') 0 0 no-repeat', backgroundSize: 'cover' }"></span>
                </div>
                <div class="photo-cell photo-button" :class="userCamera ? 'camera-btn' : null" v-if="(readOnly === undefined || !readOnly) && photoList.length < max" @click="upload()" id="photoCell" :style="{ width: photoWrapperHeight + 'px', height: photoWrapperHeight + 'px' }">
                    <span :class="userCamera ? 'icon-camera' : 'btn'"></span>
                </div>
            </div>
        </div>
        <div class="photo-preview">
            <mt-popup v-model="popupShow">
                <div class="photo">
                    <img :src="photoItem.url" width="350" height="350">
                </div>
                <mt-button class="delete" @click="sheetShow=true" type="danger" size="large" v-if="!readOnly">删除</mt-button>
                <mt-button @click="downloadFile(photoItem.index)" type="primary" size="large" v-if="download">下载</mt-button>
            </mt-popup>
            <mt-actionsheet v-model="sheetShow" :actions="actions" cancelText="取消"></mt-actionsheet>
        </div>
    </div>
</template>

<script>
var photoWrapperHeight = null;
var clientWeight = null;
export default {
    props: ['photoList', 'max', 'readOnly', 'download', 'userCamera'],
    data() {
        return {
            popupShow: false,
            sheetShow: false,
            photoItem: {
                url: '',
                index: ''
            },
            actions: [],
            photoWrapperHeight: null,
            clientWeight: null
        };
    },
    watch: {
        photoList: function() {
            
        }
    },
    created() {
        this.actions = [{
            name: '确认删除',
            method: this.deletePhoto
        }];
    },
    mounted() {
        this.$nextTick(() => {
            if (photoWrapperHeight === null) {
                photoWrapperHeight = (document.body.clientWidth - 64) / 4;
            }
            this.photoWrapperHeight = photoWrapperHeight;
        })
    },
    deactivated() {
        window.mkoBackButton.bInputData = false;
        window.mkoBackButton.callback = null;
    },
    watch: {
        popupShow: function(val) {
            window.mkoBackButton.bInputData = val;
            if (!val) this.$emit("onPopup");
        }
    },
    methods: {
        upload() {
            this.$emit('addPhotoEvent');
        },
        show(url, index) {
            this.photoItem = {
                url: url,
                index: index
            };
            this.popupShow = true;
            this.onPopupShow();
        },
        deletePhoto() {
            this.$emit('removePhotoEvent', this.photoItem.index);
            this.popupShow = false;
        },
        onPopupShow() {
            let self = this;
            window.mkoBackButton = {};
            window.mkoBackButton.callback = function() {
                self.popupShow = false
            }
        },
        downloadFile(index) {
            this.$MKOJumpOutsideURL(this.photoList[index])
        }
    }
};
</script>

<style lang="less" sccoped>
@import "../../config.less";
.photo-wrap {
    .photo-table {
        width: 100%;
        .photo-cell {
            float: left;
            position: relative;
            &.photo-button {
                margin: 12px 0 0 12px;
            }
            &.camera-btn {
                background-color: #cccccc;
                border-radius: 3px;
            }
            span {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                border-radius: 3px;
            }
            .btn {
                background: url('/static/icons/add_photo.png') 0 0 no-repeat;
                background-size: cover;
                border-radius: 3px;
            }
            .photo-btn {
                background: url('/static/icons/camera.png') 0 0 no-repeat;
                background-size: cover;
                border-radius: 3px;
            }
        }
        .photo-cell-0 {
            margin: 12px 0 0 14px;
        }
        .photo-cell-1,
        .photo-cell-2,
        .photo-cell-5,
        .photo-cell-6 {
            margin:  12px 0 0 12px;
        }
        .photo-cell-3 {
            margin: 12px 14px 0 12px;
        }
        .photo-cell-4 {
            margin-top: 12px;
            margin-left: 14px;
        }
        .photo-cell-7 {
            margin-top: 12px;
            margin-left: 14px;
        }
    }
    background: #fff;
}

.photo-preview {
    .mint-popup {
        padding-top: 30px;
        background: none;
        .photo {
            img {
                border-radius: 4px;
            }
        }
        .cancel {
            position: absolute;
            right: 0;
            top: -10px;
            font-size: 36px;
            font-weight: 600;
            color: #fff;
        }
        .delete {
            margin-top: 20px;
        }
    }
    .v-modal {
        opacity: .8;
        background: #565656;
    }
}
</style>
