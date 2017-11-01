<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    activated() {
        let from = '/enter/tasks?listType=1'
        let nextPath = `/xuncha/${this.$route.params.taskId}/start`;
        if (this.$route.query) {
            let queryString = [];
            for (let key in this.$route.query) {
                queryString.push(`${key}=${this.$route.query[key]}`)
            }
            if (this.$route.query.isReview) {
                nextPath = `/xuncha/${this.$route.params.taskId}/review?${queryString.join('&')}`
            } else {
                nextPath = `${nextPath}?${queryString.join('&')}`;
            }
            if(this.$route.query.isCheckPorintLogList) {
                nextPath = `/xuncha/${this.$route.params.taskId}/checkPorintLogList?${queryString.join('&')}`;
            }
        }
        if (this.$route.query.from == 'taskListSatus') {
            let query = this.$route.query.fromQuery
            from = {
                path: '/taskListStatus',
                query: {
                    date: query.date,
                    title: query.title,
                    taskType: query.taskType
                }
            }
        } else {
            from = this.$route.query.fromPath
        }
        this.$MKOPush(nextPath, from, true)
    },
    methods: {}
}
</script>
