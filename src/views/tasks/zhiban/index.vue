<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
import api from 'api'

export default {
    data() {
        return {}
    },
    activated() {
        let from = '/enter/tasks?listType=1'
        let nextPath = `/zhiban/start`;
        if (this.$route.query) {
            let queryString = [];
            for (let key in this.$route.query) {
                queryString.push(`${key}=${this.$route.query[key]}`)
            }
            if (this.$route.query.isReview) {
                 nextPath = `/zhiban/review?${queryString.join('&')}`
            } else {
                nextPath = `${nextPath}?${queryString.join('&')}`;
            }
        }
        if (this.$route.query.from == 'taskListSatus') {
            let query = this.$route.query.fromQuery
            from = `/taskListStatus?date=${query.date}&title=${query.title}&taskType=${query.taskType}`
        } else {
            from = this.$route.query.fromPath
        }
        this.$MKOPush(nextPath, from, true)
    },
    beforeDestroy() {
        // this.$store.dispatch('clearXunChaTimer');
        // this.$store.unregisterModule('zhiban');
    }
}

</script>
