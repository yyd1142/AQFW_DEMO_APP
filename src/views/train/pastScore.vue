<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="往期成绩" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <div @click="linkPath('/score_info/' + item.id)"  v-for="item in scores">
                <mt-cell :title="item.examTitle" :value="item.score" is-link></mt-cell>
            </div>
        </div>
        <no-data class="not-data-wrap"  v-if="notData"></no-data>
    </div>
</template>

<script>
    import api from 'api'
    import { NoData } from 'components'
    export default {
        data() {
            return {
                notData: false,
                scores: []
            }
        },
        activated() {
            this.$nextTick(() => {
                this.getPastScoreList();
            })
        },
        methods: {
            getPastScoreList() {
                let params = {
                    m: 'examResultList',
                    userName: this.$store.getters.userName
                }
                api.getPastScoreList(params).then(result => {
                    if (result.code == 0) {
                        if (result.response.length == 0) {
                            this.notData = true;
                        } else {
                            this.scores = result.response;
                        }
                    }
                })
            },
            back() {
                this.$MKOPop()
            },
            linkPath(path) {
                this.$MKOPush(path)
            }
        },
        components: {
            NoData
        }
    }
</script>

<style lang="less" scoped>
    
</style>