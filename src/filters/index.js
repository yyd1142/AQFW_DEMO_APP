import Vue from 'vue'
import moment from 'moment'
import conf from 'config'

// 日期格式化
Vue.filter('formatDate', (value, format) => {
    if (!value) {
        return "";
    }
    if (value == null) {
        return ''
    }
    let res = moment(value).format(format || "YYYY-MM-DD HH:mm");
    return res == 'Invalid date' ? '' : res;
});

// 巡查状态过滤器
// 任务状态 [1: 待执行，2: 执行中，3: 已完成，未上传 4: 已上传，处理中  5: 处理完成，待审核，6: 通过审核（已完成） 7: 已超期 8: 等待队友]
Vue.filter('taskStatusFilter', (value) => {
    let statusText = ['未开始', '未开始', '进行中', '未上传', '处理中', '待审核', '已审核', '已超期', '进行中'];
    return statusText[value];
});

// 任务列表状态颜色过滤器
Vue.filter('taskStatusColorFilter', (value) => {
    let statusColors = ['state-gray', 'state-gray', 'state-succ', 'state-succ', 'state-warning', 'state-warning', 'state-green', 'state-red'];
    return statusColors[value];
})

// 巡查 设备状态
// 设备状态 状态: 1:'正常',2:'故障',3:'维修中',4:'已停用'
// 检查设备状态 1:'正常',2:'故障',3:'维修中',4:'已停用' 5: '待审核' 6: '排除风险'  7: '确认风险'
Vue.filter('xunchaDeviceStatusFilter', value => {
    if (value == 1) {
        return "正常";
    } else if (value == 4) {
        return "已停用";
    } else if (value == 2 || value == 3 || value == 7) {
        return "处置中";
    } else if (value == 6) {
        return "已排除";
    } else if(value == 5) {
        return "风险";
    }
})

Vue.filter('xunchaDeviceStatusStyleFilter', value => {
    if (value == 2 || value == 3 || value == 4 || value == 5 || value == 7) {
        return "red-icon";
    } else if (value == 6 || value == 1) {
        return "green-icon";
    } else if (value == 0) {
        return "yellow-icon";
    } else {
        return "green-icon";
    }
})

Vue.filter('deviceStatusIconFilter', value => {
    if (value == 2 || value == 3 || value == 4 || value == 5 || value == 7) {
        return "icon-device-danger";
    } else if (value == 6 || value == 1) {
        return "icon-device-succ";
    } else if (value == 0) {
        return "icon-device-warn";
    } else {
        return "icon-device-succ";
    }
})

Vue.filter('deviceStatusColorFilter', value => {
    if (value == 2 || value == 3 || value == 4 || value == 5 || value == 7) {
        return "text-danger";
    } else if (value == 6 || value == 1) {
        return "text-success";
    } else if (value == 0) {
        return "text-warn";
    } else {
        return "text-success";
    }
})



Vue.filter('CheckPointPositionStatusFilter', (value) => {
    let status = ["未检查", "已检查"];
    return status[value];
});

// 巡查状态颜色
Vue.filter('xunchaStatusColor', (value, isICON) => {
    if (!isICON) {
        let colors = ['state-gray', 'state-blue', 'state-succ', 'state-lgray', 'state-red', 'state-warning', 'state-finish', 'font-red'];
        return colors[value];
    } else {
        let colors = ['state-gray distabled', 'state-blue distabled', 'state-succ', 'state-lgray', 'state-red', 'state-warning distabled', 'state-warning', 'font-red'];
        return colors[value];
    }
});

Vue.filter('xunchaStatusICON', (item) => {
    let status = item.status;
    let needInputData = item.needInputData;
    // 1正常，2、3处置中，4停用 5.问题
    let icons = ['need-input', 'success', 'distabled-icon', 'distabled-icon', 'distabled-icon', 'has-yh-icon', 'success', 'distabled-icon'];
    return icons[status];
})

Vue.filter('xunchaDeviceStatusStyle', (item) => {
    let status = item.status;
    let needInputData = item.needInputData;
    // 1正常，2、3处置中，4停用 5.问题
    let icons = ['yellow-icon', 'green-icon', 'yellow-icon', 'yellow-icon', 'red-icon', 'red-icon', 'green-icon', 'yellow-icon'];
    return icons[status];
})

//值班状态
Vue.filter('zhibanStatusFilter', (value) => {
    if (value == 0 || value == -1) {
        return '未开始'
    } else if (value == 1) {
        return '进行中'
    } else if (value == 2) {
        return '已完成'
    } else if (value == 3) {
        return '待审核'
    } else if (value == -2) {
        return '已超期'
    }
});

//状态颜色
Vue.filter('zhibanStatusColor', (value) => {
    if (value == -1) {
        return 'state-gray'
    } else if (value == 0) {
        return 'state-blue'
    } else if (value == 1) {
        return 'state-succ'
    } else if (value == 2) {
        return 'state-lgray'
    } else if (value == 3) {
        return 'state-warning'
    } else if (value == -2) {
        return 'state-red'
    }
});

//教育培训选项颜色
Vue.filter('errorsExamFilter', (value) => {
    if (value == 'checked') {
        return 'checked'
    } else if (value == false) {
        return 'false'
    } else {
        return 'true'
    }
});

//消防角色
Vue.filter('roleFilter', (value) => {
    const role = ['消防安全责任人', '消防安全管理人', '消防控制室管理人员', '专兼职消防管理人员', '保安', '消防引导员', '消防安全监测人员', '建设工程设计人员', '建设工程消防设施施工、监理、检测、维保等执业人员', '易燃易爆危险化学品从业人员', '电工、电气焊工等特殊工种作业人员', '专职（志愿）消防队员', '其他重点岗位人员', '社会单位员工'];
    return role[value - 1]
});

Vue.filter('roleNewFilter', (value) => {
    const role = conf.allRoleList;
    return role[value]
});

//部门
Vue.filter('departmentFilter', (value) => {
    const dpm = conf.departmentList;
    for (let item of dpm) {
        if (value == item.value)
            return item.text;
    }
});

//职责
Vue.filter('roleRulsFilter', (value) => {
    const roleRuls = ['管理', '值班', '巡查'];//0
    if (!value)
        return '';
    if (value.indexOf(',') !== -1) {
        value = value.split(',');
    }
    let str = [];
    for (let item of value) {
        str.push(roleRuls[item])
    }
    return str.join(',');
});

Vue.filter('dwJJSYZ', (value) => {
    const type = ['未知', '国有企业', '集体企业', '民营企业', '个体工商户', '中外合资企业', '外商独资企业', '股份制企业', '事业机关', '国家机关', '其它']
    return type[value]
})

Vue.filter('IDType', (value) => {
    const type = ['未知', '身份证', '港澳侨胞证', '护照']
    return type[value]
})

//性别
Vue.filter('genderFilter', (value) => {
    const gender = ['未知', '男', '女'];
    return gender[value];
});

//小数点后一位
Vue.filter('scoreFilter', (value) => {
    if (!value)
        return 0;
    if (value % 1 === 0) {
        return parseInt(value);
    } else {
        value = parseFloat(value).toFixed(1);
        return value
    }
})

Vue.filter('timeFormatFilter', (value, format) => {
    var theTime = parseInt(value / 3600);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    // alert(theTime);
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        // alert(theTime1+"-"+theTime);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var result = "" + parseInt(theTime) + "秒";
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
    }
    return result;
})

// 楼层
export const levelFr = function (num) {
    return (num + '').replace(/-/, '负');
};

//分数
export const calcScoreText = function (val) {
    let text = ['极低', '较低', '中等', '良好', '优秀'];
    if (!val || !parseInt(val))
        return '';
    if (val >= 90) {
        return text[4]
    } else if (val >= 80) {
        return text[3]
    } else if (val >= 70) {
        return text[2]
    } else if (val >= 60) {
        return text[1]
    } else {
        return text[0]
    }
};

export const calcScoreStyle = function (val) {
    val = parseInt(val);
    if (!val)
        return '#4EB4F1';
    if (val >= 90) {
        return '#4EB4F1'
    } else if (val >= 80) {
        return '#57D4E7'
    } else if (val >= 70) {
        return '#9CED63'
    } else if (val >= 60) {
        return '#F4DA37'
    } else {
        return '#F87F42'
    }
};


Vue.filter('calcHeadColor', (val, color) => {
    if (!color) color = ['#A282F5', '#799BF7', '#a3d450', '#D4CD2C', '#f3a972'];
    if (!val || !parseInt(val)) return color[0];
    val = parseInt(val);
    if (val >= 90) {
        return color[0]
    } else if (val >= 80) {
        return color[1]
    } else if (val >= 70) {
        return color[2]
    } else if (val >= 60) {
        return color[3]
    } else {
        return color[4]
    }
});

export const calcBannerCircle = function (val) {
    if (!val)
        return 'null';
    let c = Math.floor(val / 10);
    if (c < 2)
        return '1';
    c += '0';
    return c;
};

export const calcBannerBg = function (val) {
    if (!val || !parseInt(val))
        return '90';
    let c = Math.floor(val / 10);
    if (c < 6)
        c = '';
    c += '0';
    return c;
};

export const descriptionFilter = function (val) {
    if (val.length >= 35) {
        return `${val.substr(0, 35)}...`
    } else {
        return val;
    }
};

Vue.filter('frequencyFr', function (value) {
    /*巡查频率，"1/1/1"//
     3天/1次  不要巡查 "0/0/0"
      1.//第一个字段是类型，  
     1://按天计算，以天单位的时间，
     3表示3天   2：//按周  3://按季度
      4://半个月,15号分界线  5://按月,月底分界线
     6://按半年,6月底分界线  7://按年
     */
    if(!value){
        return '--'
    }
    let _l = {}
    let types = {
        '0/0/0': '不需要',
        '2/0/1': '每周1次',
        '3/0/ 1 ': '每季度1次',
        '4/0/1': '半月1次',
        '5/0/1': '每月1次',
        '6/0/1': '每半年1次',
        '7/0/1': '每年1次'
    }
    for (let i = 0; i < 3; i++) {
        _l[`1/1/${i + 1}`] = `每日${i + 1}次`
    }
    for (let i = 1; i < 6; i++) {
        _l[`1/${(i + 1)}/1`] = `${i + 1}天1次`
    }
    types = Object.assign(_l, types)
    return types[value] || '未知频率'
})


export const formatDate = Vue.filter('formatDate')
export const deviceStatusColorFilter = Vue.filter('deviceStatusColorFilter')
export const deviceStatusIconFilter = Vue.filter('deviceStatusIconFilter')
const taskStatusFilter = Vue.filter('taskStatusFilter')
const xunchaStatusColor = Vue.filter('xunchaStatusColor')
const zhibanStatusFilter = Vue.filter('zhibanStatusFilter')
const zhibanStatusColor = Vue.filter('zhibanStatusColor')
const errorsExamFilter = Vue.filter('errorsExamFilter')
export const roleFilter = Vue.filter('roleFilter')
const dwJJSYZ = Vue.filter('dwJJSYZ')
const IDType = Vue.filter('IDType')
const xunchaStatusICON = Vue.filter('xunchaStatusICON')
const taskStatusColorFilter = Vue.filter('taskStatusColorFilter')
export const genderFilter = Vue.filter('genderFilter')
export const scoreFilter = Vue.filter('scoreFilter')
export const timeFormatFilter = Vue.filter('timeFormatFilter')
export const frequencyFr = Vue.filter('frequencyFr')
export const calcHeadColor = Vue.filter('calcHeadColor')
export default {
    formatDate,
    deviceStatusColorFilter,
    deviceStatusIconFilter,
    taskStatusFilter,
    xunchaStatusColor,
    errorsExamFilter,
    dwJJSYZ,
    IDType,
    xunchaStatusICON,
    taskStatusColorFilter,
    genderFilter,
    calcScoreText,
    calcScoreStyle,
    calcHeadColor,
    calcBannerCircle,
    calcBannerBg,
    descriptionFilter,
    scoreFilter,
    levelFr,
    timeFormatFilter,
    frequencyFr
}
