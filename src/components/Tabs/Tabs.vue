<template>
    <div>
        <nav class="home-tabs-wrap">
            <div class="home-tab-item" :class="actived == item.name ? 'actived' : null" @click="tab(item, index)" v-for="(item, index) in tabs" >
                <i :class="item.icon"></i>
                <span>{{item.text}}</span>
            </div>
        </nav>
    </div>
</template>

<style lang="less" scoped>
    @import "../../config.less";
    .home-icon(@x, @y) {
        background: url('/static/icons/resource.png') @x @y no-repeat;
        background-size: @bg-size;
    }

    .home-tabs-wrap {
        width: 100%;
        position: fixed;
        bottom: -1px;
        z-index: 10;
        height: 50px;
        background: rgba(247, 247, 247, 0.95);
        .actived {
            color: @blueColor !important;
            .shouye-zhengchang {
                .home-icon(-796px,
                -262px) !important;
            }
            .renwu-zhengchang {
                .home-icon(-820px,
                -262px) !important;
            }
            .tongxunlu-zhengchang {
                .home-icon(-844px,
                -262px) !important;
            }
            .wode-zhengchang {
                .home-icon(-869px,
                -262px) !important;
            }
        }
        .home-tab-item {
            width: 25%;
            height: 50px;
            float: left;
            text-align: center;
            padding-top: 6px;
            color: #979797;
            i {
                width: 24px;
                height: 24px;
                display: block;
                margin: 0 auto 2px auto;
                &.shouye-zhengchang {
                    .home-icon(-796px,
                    -238px);
                }
                &.renwu-zhengchang {
                    .home-icon(-820px,
                    -238px);
                }
                &.tongxunlu-zhengchang {
                    .home-icon(-844px,
                    -238px);
                }
                &.wode-zhengchang {
                    .home-icon(-869px,
                    -238px);
                }
            }
            span {
                width: 100%;
                text-align: center;
                float: left;
                font-size: 10px;
            }
        }
    }
</style>

<script>
    export default {
        props: ['actived'],
        data() {
            return {
                tabs: [{
                    text: '首页',
                    name: 'home',
                    actived: 'actived',
                    url: '/enter/home',
                    icon: 'shouye-zhengchang'
                }, {
                    text: '任务',
                    name: 'tasks',
                    actived: '',
                    url: '/enter/tasks_manage',
                    icon: 'renwu-zhengchang'
                }, {
                    text: '人员',
                    name: 'mail',
                    actived: '',
                    url: '/enter/mail_list',
                    icon: 'tongxunlu-zhengchang'
                }, {
                    text: '我的',
                    name: 'my',
                    actived: '',
                    url: '/enter/my',
                    icon: 'wode-zhengchang'
                }]
            }
        },
        activated() {
            let isAdmin = this.$store.state.user.isAdmin;
            for(let tab of this.tabs) {
                if(tab.name === 'tasks') {
                    tab.url = isAdmin ? '/enter/tasks_manage' : '/taskComply';
                }
            }
        },
        methods: {
            tab(item, index) {
                this.$MKOJump(item.url);
            }
        }
    }
</script>
