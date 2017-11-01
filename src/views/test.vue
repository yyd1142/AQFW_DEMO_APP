<template>
    <div class='test'>
        <!-- <div v-for="(i, index) in datas">
                                                                                        <div v-for="(j, jIndex) in i.taskZibans" @click="bb(i, j, index, jIndex)">
                                                                                            <div v-text="j.time || '暂无'"></div>
                                                                                        </div>
                                                                                    </div> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            datas: []
        }
    },
    mounted() {
        this.test()
    },
    methods: {
        test() {
            let arr = [17, 4, 5, 5, 6];
            arr = arr.reverse()
            console.log(arr)
        }
    }
}
</script>

<style>

</style>
