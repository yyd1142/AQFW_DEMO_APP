<template>
    <div class="mko-edit-card" :class="{'is-edit':isEdit}">
        <div class="title-wrap" v-if="editDisabled===un">
            <div class="title fl" :class="titleColor ? titleColor : ''">{{title || ''}}</div>
            <div v-show="!isRemove">
                <div class="btn fr" @click="editFn" v-show="mode != 'readOnly'">{{isEdit ? (cancelBtnText || '取消') : (editBtnText || '编辑')}}</div>
                <div class="btn fr" :class="{'disabled-btn':(!validate&&this.validate !== un)}" @click="saveFn" v-show="isEdit">
                    {{saveBtnText || '保存'}}
                </div>
            </div>
            <div class="btn fr" @click="removeFn" v-if="isRemove">
                <i class="icon icon-remove-red"></i>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        //组件不加validate参数代表不做验证
        //组件添加edit-disabled代表无标题栏
        props: ['title', 'edit', 'validate', 'edit-disabled', 'edit-btn-text', 'save-btn-text', 'cancel-btn-text', 'remove', 'titleColor', 'mode'],
        data() {
            return {
                un: undefined
            }
        },
        watch: {},
        computed: {
            isEdit() {
                if (!this.edit && this.edit !== '') {
                    return false;
                } else {
                    return true;
                }
            },
            isRemove() {
                if (this.remove) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        mounted() {
        },
        activated() {
        },
        deactivated() {
        },
        destroyed() {
        },
        methods: {
            editFn() {
                this.$emit('edit');
            },
            saveFn() {
                this.$emit('save');
            },
            removeFn() {
                this.$emit('remove')
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .mko-edit-card {
        margin: 13px 6px 0 9px;
        border-radius: 4px;
        box-shadow: 0 -3px 0 @mainBlue;
        &.is-edit {
            margin-top: 10px;
            padding-bottom: 1px;
            border: 1px solid @mainBlue;
            border-top: 3px solid @mainBlue;
            box-shadow: none;
        }
        > :first-child {
            border-top-right-radius: 4px;
            border-top-left-radius: 4px;
        }
        > :last-child {
            border-bottom-right-radius: 4px;
            border-bottom-left-radius: 4px;
        }
        .title-wrap {
            height: 44px;
            padding: 0 10px;
            background-color: #fff;
            color: @mainBlue;
            .border-btm(@baseBorder);
            .title {
                line-height: 44px;
                font-weight: 900;
                font-size: 16px;
                color: @baseText01;
            }
            .btn {
                position: relative;
                z-index: 1;
                line-height: 44px;
                font-size: 14px;
                &.fr {
                    margin-left: 18px;
                }
                .icon {
                    position: absolute;
                    margin: auto;
                    top: 40px;
                    bottom: 0;
                    right: 0;
                }
            }
            .disabled-btn {
                opacity: .3;
            }
            + .mint-cell .mint-cell-wrapper {
                background-image: none;
            }
        }
        .mko-form-cell {
            padding-left: 10px !important;
            &:first-child {
                &:before{
                    display: none;
                }
            }
            &:last-child {
                &:after {
                    display: none;
                }
            }
            .cell {
                padding-right: 10px !important;
            }
        }
    }
</style>
