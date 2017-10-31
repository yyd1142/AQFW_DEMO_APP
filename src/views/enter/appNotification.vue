<template>
    <div id="appNotification">
    </div>
</template>

<script>
import api from 'api'
import xuncha from 'store/modules/xuncha'
import zhiban from 'store/modules/zhiban'
import * as types from 'store/mutation-types'
var fromPath = '/enter/home'
var notificationParams = {};
export default {
    activated() {
        let userData = localStorage.getItem('USER_DATA');
        notificationParams = this.$route.query.params;
        if (userData && userData.length > 0) {
            this.messageTypeFilter(notificationParams)
        } else {
            this.$MKOJump('/login');
        }
    },
    methods: {
        goTaskInfo(task) {
            let name = 'xuncha'
            if (task.taskType == 1)
                name = "zhiban"

            if (name == 'xuncha') {
                this.$store.registerModule('xuncha', xuncha);
                this.$store.commit(types.XUNCHA_INIT_TASK_DATA, task);
                localStorage.setItem('lastXunChaTaskId', task.taskId);
            }
            if (name == 'zhiban') {
                this.$store.registerModule('zhiban', zhiban);
                this.$store.commit(types.ZHIBAN_INIT_DATA, task);
                localStorage.setItem('lastZhiBanTaskId', task.taskId);
            }
            this.$MKOPush({
                name: name,
                params: {
                    taskId: task.taskId
                },
                query: {
                    from: 'home',
                    isReview: false,
                    fromPath: fromPath
                }
            })
        },
        reViewTask(task) {
            if (task.status == 1 || task.status == 2 || task.status == 3 || task.status == 4 || task.status == 7) {
                if (this.$store.getters.userName === task.creater) {
                  this.$MKODialog({msg:'该任务还未执行，请在我的任务中执行'});
                } else {
                  this.$MKODialog({msg:'不能查看未开始、执行中、已超期的任务详情'});
                }
                return;
            }
            let name = 'xuncha'
            if (task.taskType == 1)
                name = "zhiban"

            if (name == 'xuncha') {
                localStorage.setItem('lastReviewXunChaData', JSON.stringify(task));
                localStorage.setItem('lastXunChaTaskId', task.taskId);
                // this.$store.commit(types.XUNCHA_INIT_TASK_DATA, task);
            }
            if (name == 'zhiban') {
                localStorage.setItem('lastReviewZhiBanData', JSON.stringify(task));
                localStorage.setItem('lastZhiBanTaskId', task.taskId);
                // this.$store.commit(types.ZHIBAN_INIT_TASK_DATA, task);
            }
            this.$MKOPush({
                name: name,
                params: {
                    taskId: task.taskId
                },
                query: {
                    from: 'home',
                    isReview: true,
                    fromPath: fromPath
                }
            })
        },
        linkPath(routeOption) {
            this.$MKOPush(routeOption, fromPath, true);
        },
        messageTypeFilter(val) {
            if (val.name == '') {
                this.$MKOJump(fromPath)
                return false
            }
            if (val.name == 'yhk') {
                this.linkPath({ path: `/hidden_danger_info/${val.id}` })
            } else if (val.name == 'notice') {
                this.linkPath({
                    path: `/notice/${val.noticeId}?from=notification`
                })
            } else if (val.name == 'task') {
                this.getTaskInfo(val.taskId)
            } else if (val.name == 'safetyFile') {
                this.linkPath({ path: `/safe_activity` })
            } else {
                this.$MKOJump(fromPath)
            }
        },
        getTaskInfo(id) {
            api.getTaskInfo({
                taskId: id
            }).then(res => {
                if (!res) return false;
                if (res.code == 0) {
                    if (res.response.groupId == this.$store.getters.groupId) {
                        if (res.response.status == 5) {
                            this.reViewTask(res.response)
                        } else {
                            this.goTaskInfo(res.response)
                        }
                    } else {
                        this.$MKOJump(fromPath)
                    }

                }
            })
        }
    }

}
</script>

