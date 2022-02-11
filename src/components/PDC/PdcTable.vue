<template>
  <h1 v-if="!tableData.length">本学期该年级的培养方案为空</h1>
  <table v-if="tableData.length">
    <tr>
      <th>课程名</th>
      <th>类型</th>
      <th>授课教师</th>
      <th>分组</th>
      <th class="WeekCol">𝚺</th>
      <th class="WeekCol">1</th>
      <th class="WeekCol">2</th>
      <th class="WeekCol">3</th>
      <th class="WeekCol">4</th>
      <th class="WeekCol">5</th>
      <th class="WeekCol">6</th>
      <th class="WeekCol">7</th>
      <th class="WeekCol">8</th>
      <th class="WeekCol">9</th>
      <th class="WeekCol">10</th>
      <th class="WeekCol">11</th>
      <th class="WeekCol">12</th>
      <th class="WeekCol">13</th>
      <th class="WeekCol">14</th>
      <th class="WeekCol">15</th>
      <th class="WeekCol">16</th>
      <th class="WeekCol">17</th>
      <th class="WeekCol">18</th>
      <th class="WeekCol">19</th>
      <th class="WeekCol">20</th>
    </tr>
    <tr v-for="(item, index) in tableData" :key="index" :style="{backgroundColor:'#'+item.color}">
      <template v-if="useMenu">
        <td v-if="item.info" :rowspan="item.rowSpan" v-right-click:[item._data]="menuHandle.courseInfo()">
          {{ item.info }}
        </td>

        <template v-if="item.method">
          <td v-right-click:[item._data]="menuHandle.coursePlan()">{{ item.method }}</td>
        </template>
        <template v-else>
          <td v-right-click:[item._data]="menuHandle.courseInfo()">暂无教学计划</td>
        </template>
      </template>

      <template v-if="!useMenu">
        <td v-if="item.info" :rowspan="item.rowSpan">{{ item.info }}</td>
        <td>{{ item.method }}</td>
      </template>

      <td>{{ item.teacher }}</td>
      <td>{{ item.groups }}</td>
      <td v-for="(_week, _index) in item.weekRecord" :key="_index" class="WeekCol">
        {{ item._data.plan_id ? (_week ? _week : "") : " " }}
      </td>
    </tr>
  </table>

  <el-dialog v-model="dialogData.show" :title="`${dialogData.title}`" :fullscreen="false" width="90%">
    <div class="dialogBody">
      <div class="TimeBlock">
        <div class="TimeBlockItem">星期一</div>
        <div class="TimeBlockItem">星期二</div>
        <div class="TimeBlockItem">星期三</div>
        <div class="TimeBlockItem">星期四</div>
        <div class="TimeBlockItem">星期五</div>
        <div class="TimeBlockItem">星期六</div>
        <div class="TimeBlockItem">星期日</div>
        <el-radio-group v-model="dialogData.timeBlockIndex">
          <template v-for="row in 5" :key="row">
            <el-radio-button class="TimeBlockItem" :label="`${row},${col}`" @click="1" v-for="col in 7" :key="col">第{{ row * 2 - 1 }}-{{ row * 2 }}节
            </el-radio-button>
          </template>
        </el-radio-group>
      </div>

      <div class="WeekSelector">
        <el-cascader placeholder="(多选)请选择开课周数" collapse-tags v-model="dialogData.weekSelected"
                     :show-all-levels="true" :options="dialogData.weekOptions" :props="dialogData.props" clearable/>
      </div>

      <div class="ClassroomSelector">
        <el-button type="primary" :disabled="!dialogData.weekSelected.length" round @click="getClassroomData">获取可用教室</el-button>
        <el-select v-if="dialogData.apiData.classrooms" v-model="dialogData.selectedClassroom" class="m-2"
                   placeholder="选择教室">
          <el-option
              v-for="item in dialogData.apiData.classrooms"
              :key="item.room_id"
              :label="item.name"
              :value="item.room_id"
          >
          </el-option>
        </el-select>
      </div>

      <div class="CommitButton">
        <el-button type="success" :disabled="!dialogData.canAddCourse" round @click="addCourse">确定添加</el-button>
      </div>
    </div>

  </el-dialog>

</template>

<script setup>
import {
  computed,
  defineProps, reactive, ref, watch,
} from "vue";
import {ElLoading} from "element-plus";
import axios from "axios";

const props = defineProps({
  tableData: {
    type: Array,
    required: true,
  },
  maxWeek: {
    type: Number,
    default() {
      return 20;
    },
  },
  useMenu: {
    type: Boolean,
    // Object or array defaults must be returned from a factory function
    default() {
      return false;
    },
  },
});

function WeekOptionChild(value) {
  this.value = value;
  this.label = "第" + value + "周";
  this.children = [];
}

// region 对话框
const dialogData = reactive({
  show: false,
  plan_id: null,
  plan: null,
  selectedClassroom: null,
  apiData: {
    classrooms: null,
    dates: null,
  },
  canAddCourse: computed(() => {
    return !!(dialogData.plan && dialogData.selectedClassroom && dialogData.apiData.dates);
  }),
  weekSelected: [],
  title: computed(() => {
    if (dialogData.plan) {
      let plan = dialogData.plan;
      console.log(plan);
      let groups = "";
      if (plan.groups && plan.groups.length !== 0) {
        let _groups = [];
        for (let _group of plan.groups) {
          _groups.push(_group.name);
        }
        groups = _groups.join("&");
      }
      return `${plan.info.ch_name}-${plan.method}-${plan.teacher.name}-${groups}`;
    } else {
      return null;
    }
  }),
  timeBlockIndex: "1,1",
  what_day: computed(() => dialogData.timeBlockIndex.split(",")[1]),
  which_lesson: computed(() => dialogData.timeBlockIndex.split(",")[0]),
  props: {
    multiple: true,
  },
  weekOptions: computed(() => {
    let flag = 1;
    let options = [];
    for (let i = 1; i <= props.maxWeek; i++, flag++) {
      if (i === 1) {
        options.push(new WeekOptionChild(i));
      }
      options[options.length - 1].children.push(new WeekOptionChild(i));
      if (flag >= 5) {
        let lastOption = options[options.length - 1];
        options[options.length - 1].label = `${lastOption.value}-${i}`;
        if (i + 1 <= props.maxWeek) {
          options.push(new WeekOptionChild(i));
          flag = 0;
        }
      }
    }
    return options;
  }),
});
// endregion

const menuHandle = {
  // 右键菜单对象，菜单内容和处理事件
  courseInfo() {
    return {
      this: this,
      text: [
        "编辑课程信息",
        "新增理论课(Course)",
        "新增习题课(TD)",
        "新增实验课(TP)",
        "新增考试(Exam)",
        "取消",
      ],
      handler: {
        editInfo(context) {
          console.log(context);
          console.log("编辑课程信息");
          // TODO: 加字母
          window.location.href = `/admin/course/courseinfo/${context.info_id}/change/`;
        },
        addPlanCourse(context) {
          console.log("新增理论课教学计划");
          window.location.href = `/admin/course/courseplan/add/?info=${context.info_id}&method=Course`;
        },
        addPlanTd(context) {
          console.log("新增习题课教学计划");
          window.location.href = `/admin/course/courseplan/add/?info=${context.info_id}&method=TD`;
        },
        addPlanTp(context) {
          console.log("新增实验课教学计划");
          window.location.href = `/admin/course/courseplan/add/?info=${context.info_id}&method=TP`;
        },
        addPlanDs(context) {
          console.log("新增考试计划");
          window.location.href = `/admin/course/courseplan/add/?info=${context.info_id}&method=DS`;
        },
        _cancel() {
          console.log("取消");
        },
      },
    };
  },
  coursePlan() {
    return {
      this: this,
      text: [
        "编辑该教学计划",
        "排课",
        "取消",
      ],
      handler: {
        editCoursePlan(context) {
          console.log(context);
          console.log("查看资料点击事件");
          window.location.href = `/admin/course/courseplan/${context.plan_id}/change/`;
        },
        addCourse(context) {
          console.log("添加课程", context);
          dialogData.show = true;
          dialogData.plan_id = context.plan_id;
          dialogData.plan = context.plan;
        },
        _cancel() {
          console.log("取消");
        },
      },
    };
  },
};

const getClassroomData = () => {
  fetchingData.value = true;
  let _weeks = [];
  for (const weekSelectedElement of dialogData.weekSelected) {
    _weeks.push(weekSelectedElement[1]);
  }
  axios.get(
      `https://siae.top/course/advanced/api/classroom/?week=${_weeks.join(",")}&what_day=${dialogData.what_day}&which_lesson=${dialogData.which_lesson}`,
  ).then(
      response => {
        if (response.data.results) {
          dialogData.apiData.dates = response.data.dates;
          dialogData.apiData.classrooms = response.data.results;
        }
        fetchingData.value = false;
      },
      error => {
        console.warn(error.message);
        fetchingData.value = false;
      },
  );
};


//region 正在加载
const fetchingData = ref(false);
let loadService = null;

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
//endregion

watch(() => dialogData.timeBlockIndex, () => {
  dialogData.apiData.classrooms = null;
  dialogData.apiData.dates = null;
});

watch(() => dialogData.weekSelected, () => {
  dialogData.apiData.classrooms = null;
  dialogData.apiData.dates = null;
}, {deep: true});

function initStatusAfterAdd() {
  dialogData.show = false;
  dialogData.weekSelected = [];
  fetchingData.value = false;
  location.reload();
}

const addCourse = () => {
  fetchingData.value = true;

  //axios.post(`https://siae.top/course/api/CourseForPost/`, {plan:1,room:3,date:"2022-05-20",which_lesson:5})

  function post(data) {
    console.log(data);
    axios.post(`https://siae.top/course/api/CourseForPost/`, data).then(
        response => {
          console.log(response);
          initStatusAfterAdd();
        },
        error => {
          console.warn(error.message);
        },
    );
  }

  for (const date of dialogData.apiData.dates) {
    post({
      plan: dialogData.plan_id, room: dialogData.selectedClassroom,
      date: date, which_lesson: dialogData.which_lesson,
    });
  }
};

</script>

<style>
table {
  width: 100%;
  border-spacing: 0;
}

tr, th, td {
  border: black solid 1px;
  padding: 5px;
}

.WeekCol {
  width: 20px;
}

.TimeBlock {
  display: flex;
  flex-wrap: wrap;
}

.TimeBlockItem {
  width: 14%;
  border: black 1px solid;
  flex-wrap: wrap;
}

.TimeBlock .el-radio-button__inner {
  width: 100%;
}

/*.WeekSelector .el-input__inner {*/
/*  width: 90vh !important;*/
/*}*/

.WeekSelector {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.dialogBody {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.CommitButton {
  margin-top: 20px;
}

/*右键菜单的样式 强制调整*/
.right-menu ul li {
  padding: 0 !important;
  border-bottom: none !important;
}

.ClassroomSelector > * {
  margin-left: 20px;
}
</style>
