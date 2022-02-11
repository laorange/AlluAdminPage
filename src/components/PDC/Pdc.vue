<template>
  <div class="PdcHeader">
    <div>
      <el-tooltip class="box-item" effect="dark" content="从2007.9起始的第?学期" placement="bottom">学期戳：</el-tooltip>
      <el-tooltip class="box-item" effect="dark" :content="get_period_display(data.period)" placement="bottom">
        <el-input-number v-model="data.period" :min="29" @change="handlePeriodChange"/>
      </el-tooltip>
    </div>
    <div>
      <el-select v-model="data.semester" class="m-2" placeholder="选择年级">
        <el-option v-for="item in semesterOptions" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div>
      <el-button type="primary" :icon="Refresh" @click="refreshCourseInfoData">获取数据</el-button>
    </div>
  </div>

  <pdc-table :tableData="tableData" :useMenu="true" :max-week="semesterConfig.max_week"></pdc-table>

</template>

<script setup>
import {computed, reactive, onMounted, ref, watch} from "vue";
import axios from "axios";
import {Refresh} from "@element-plus/icons-vue";

import PdcTable from "./PdcTable";
import {ElLoading} from "element-plus";

let semesterConfig = {
  "current_period": 30,
  "current_period_display": "2022.02~2022.07",
  "week1_monday_date": "2022-02-28 00:00:00",
  "max_week": 20,
};

const data = reactive({
  period: parseInt(localStorage.getItem("period")) || semesterConfig.current_period,
  semester: parseInt(localStorage.getItem("semester")) || (2 - semesterConfig.current_period % 2),
});
const fetchingData = ref(false);
let loadService = null;

watch(data, (newData) => {
  localStorage.setItem("period", "" + newData.period);
  localStorage.setItem("semester", "" + newData.semester);
}, {deep: true});

watch(fetchingData, (newStatus) => {
  if (newStatus) {
    loadService = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
  } else {
    if (loadService) {
      loadService.close();
    }
  }
});

const semesterOptions = computed(() => {
  if (data.period % 2) {
    return [{
      value: 1,
      label: "大一上",
    },
      {
        value: 3,
        label: "大二上",
      },
      {
        value: 5,
        label: "大三上",
      },
      {
        value: 7,
        label: "大四上",
      },
      {
        value: 9,
        label: "研一上",
      },
      {
        value: 11,
        label: "研二上",
      },
    ];
  } else {
    return [{
      value: 2,
      label: "大一下",
    },
      {
        value: 4,
        label: "大二下",
      },
      {
        value: 6,
        label: "大三下",
      },
      {
        value: 8,
        label: "大四下",
      },
      {
        value: 10,
        label: "研一下",
      },
      {
        value: 12,
        label: "研二下",
      },
    ];
  }
});
let courseInfo3d = ref([]);

function getItemData(data = null, info = "课程信息", color = "ffffff", method = null, teacher = "", group = "") {
  return {
    info: info,
    method: method,
    teacher: teacher,
    groups: group,
    rowSpan: 1,
    color: color,
    weekRecord: (new Array(semesterConfig.max_week + 1)).fill(0),
    _data: data,
  };
}

const tableData = computed(() => {
  let cookedData = [];

  //region 代码逻辑绝不更改，能跑就别动
  for (let info of courseInfo3d.value) {
    let itemData = getItemData(info, info.ch_name, info.type.color);

    if (info.info_plan.length === 0) {
      cookedData.push(itemData);
    } else {
      itemData.rowSpan = info.info_plan.length;
      for (let planIndex in info.info_plan) {
        itemData.weekRecord.fill(0); //初始化每个PDC的课时统计
        let plan = info.info_plan[planIndex];
        if (planIndex !== "0") {
          itemData.info = null;   //对多plan的CourseInfo的课程名置空
        }
        itemData.method = plan.method;
        itemData.teacher = plan.teacher.name;
        if (plan.groups.length !== 0) {
          itemData._data.plan_id = plan.plan_id;
          itemData._data.plan = plan;
          let _groups = [];
          for (let _group of plan.groups) {
            _groups.push(_group.name);
          }
          itemData.groups = _groups.join("&");
          if (plan.plan_course.length !== 0) {
            for (const planCourseElement of plan.plan_course) {
              let _week = parseInt(
                  (new Date(planCourseElement.date) - new Date(semesterConfig.week1_monday_date)) / 604800000 + 1,
              );
              if (0 <= _week < semesterConfig.max_week) {
                itemData.weekRecord[_week] += 2;
              }
            }
            itemData.weekRecord[0] = eval(itemData.weekRecord.join("+"));  //数组第一位为课时总和
          }
          cookedData.push(JSON.parse(JSON.stringify(itemData)));
        }
      }
    }
  }
  //endregion

  return cookedData;
});

function pad0(o) {
  return ("" + o).padStart(2, "0");
}

const get_period_display = (period) => {
  if (period) {
    let n1, n2, m1, m2;
    n1 = n2 = parseInt(period / 2, 10) + 7;
    if (period % 2) {
      m1 = 9;
      m2 = 1;
      n2++;
    } else {
      m1 = 2;
      m2 = 7;
    }
    return `20${pad0(n1)}.${pad0(m1)}~20${pad0(n2)}.${pad0(m2)}`;
  } else {
    return "";
  }
};

const handlePeriodChange = (newValue, oldValue) => {
  if (newValue - oldValue === 1 || newValue - oldValue === -1) {
    data.semester += newValue - oldValue;
  } else if ((newValue - oldValue) % 2 !== 0) {
    data.semester += newValue % 2 === 0 ? 1 : -1;
  }
  if (data.semester <= 0 || data.semester > 12) {
    data.semester = 2 - newValue % 2;
  }
};

const addCourseInfoData = (url) => {
  fetchingData.value = true;
  axios.get(url).then(
      response => {

        if (response.data.results) {

          for (const courseInfo of response.data.results) {

            courseInfo3d.value.push(courseInfo);
          }
        }
        if (response.data.next) {

          addCourseInfoData(response.data.next);
        }
        fetchingData.value = false;
      },
      error => {
        console.warn(error.message);
        fetchingData.value = false;
      },
  );
};

const refreshCourseInfoData = () => {
  courseInfo3d.value.splice(0, courseInfo3d.value.length);

  addCourseInfoData(`https://siae.top/course/api/CourseInfo3d/?period=${data.period}&semester=${data.semester}`);
};

onMounted(() => {
  axios.get("https://siae.top/course/api/SemesterConfig/").then(
      response => {

        if (response.data.results) {
          semesterConfig = response.data.results[0];
        }
        //  第二轮请求
        refreshCourseInfoData();
      },
      error => {
        console.warn(error.message);
      },
  );
});


</script>

<style scoped>
.PdcHeader {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.PdcHeader div {
  margin: 5px;
}
</style>
