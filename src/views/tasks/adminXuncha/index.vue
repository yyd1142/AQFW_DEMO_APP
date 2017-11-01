<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
    import api from 'api'

    /*
    checkPoints 数据结构，数组
    {
        title: '万象城A座1楼',
        positions: [{
        name: '消控室',
        status: '1'
        }]
    }
    */

    /*
    QiaoDaoXunCha 数据组结构
    {
        photos: ["fdssalkds", "fdsaipjfdvcxds"],
        devices:[
            [{
                id: 293,
                code: '',
                unitId: '1',
                unitName: '水泵-001',
                status: '1'
            },{
                id: 293,
                code: '',
                unitId: '1',
                unitName: '水泵-001',
                status: '1'
            }],
            [{
                id: 295,
                name: '水泵-003',
                status: '1'
            }],
        ]
    }
    */

    /*
    checkRules 数据规则，数组
    [{
      "conclusionNo": "不正常",
      "conclusionType": 0,
      "conclusionYes": "正常",
      "content": "启动装置外观及工作状态",
      "dataName": "",
      "id": 3,
      "needInputData": 0,
      "ruleType": 2,
      "unitId": 2
    },{
      "conclusionNo": "不正常",
      "conclusionType": 0,
      "conclusionYes": "正常",
      "content": "燃料储量",
      "dataName": "",
      "id": 4,
      "needInputData": 0,
      "ruleType": 2,
      "unitId": 2
    }]
    */

    export default {
        data() {
            return {
                checkPoints: [],
                qiaoDaoXunChaTitle: '',
                qiaoDaoXunChaData: {},
                checkRules: []
            }
        },
        mounted() {
            api.getXCTaskPosition({
                taskId: '09bfd9b4af6640d39d3e5d2a89f233d2'
            }).then(res => {
                try{
                    let position = JSON.parse(res.response.position);
                    let checkPoints = [];
                    for (let p of position){
                        let v = p.name.split('-');
                        let k = `${v[0]}${v[1]}`
                        let obj = checkPoints[k];
                        if (obj){
                            obj.positions.push({name: v[2], status: 1});
                        }else {
                            obj = {title: k, positions: []};
                            obj.positions.push({name: v[2], status: 1});
                            obj.status = 1;
                            checkPoints.push(obj);
                        }
                    }
                    this.checkPoints = checkPoints;
                }catch(e){

                }
            })
        },
        methods: {
            qiandao(item) {
                api.getXCTaskDeviceByPosition({
                    jzId: 6,
                    jzLevel: 4,
                    jzPosition: 'cesuo'
                }).then(res => {
                    let groups = new Map();
                    for (let device of res.response){
                        let devices = groups.get(device.unitId);
                        if (!devices){
                            devices = [device];
                            groups.set(device.unitId, devices);
                        }else {
                            devices.push(device);
                        }
                    }
                    this.qiaoDaoXunChaTitle = item.title;
                    let g = [];
                    for (let k of groups.keys()){
                        g.push(groups.get(k));
                    }
                    this.qiaoDaoXunChaData = {
                        photos: [],
                        devices: g
                    }
                })
            },
            device(item) {
                api.getXCTaskDeviceCheckRulesByUnitId({
                    unitId: item.unitId
                }).then(res => {
                    this.checkRules = res.response;
                })
            }
        }
    }

</script>