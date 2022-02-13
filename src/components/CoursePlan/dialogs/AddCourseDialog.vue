<template>
  <el-dialog v-model="store.AddCourseDialogData.ifShow" :title="store.AddCourseDialogTitle" :fullscreen="false" width="90%">
    <div class="dialogBody">
      <div class="TimeBlock">
        <div class="TimeBlockItem">星期一</div>
        <div class="TimeBlockItem">星期二</div>
        <div class="TimeBlockItem">星期三</div>
        <div class="TimeBlockItem">星期四</div>
        <div class="TimeBlockItem">星期五</div>
        <div class="TimeBlockItem">星期六</div>
        <div class="TimeBlockItem">星期日</div>

        <el-checkbox-group :style="{width:'100%'}" v-model="data.timeBlockIndexes">
          <template v-for="row in 5" :key="row">
            <el-checkbox-button class="TimeBlockItem" :label="`${row},${col}`" @click="1" v-for="col in 7" :key="col">
              第{{ row * 2 - 1 }}-{{ row * 2 }}节
            </el-checkbox-button>
          </template>
        </el-checkbox-group>
      </div>

      <div class="WeekSelector">
        <el-cascader placeholder="(多选)请选择开课周数" collapse-tags v-model="data.weekSelected"
                     :show-all-levels="true" :options="data.weekOptions" :props="data.props" clearable/>
      </div>

      <div class="ClassroomSelector">
        <el-button type="primary" :disabled="!data.weekSelected.length" round @click="getClassroomData">获取可用教室</el-button>
        <el-select v-if="apiData.classrooms" v-model="data.selectedClassroom" class="m-2"
                   placeholder="选择教室">
          <el-option
              v-for="item in apiData.classrooms"
              :key="item.room_id"
              :label="item.name"
              :value="item.room_id"
          >
          </el-option>
        </el-select>
      </div>

      <div class="CommitButton">
        <el-button type="success" :disabled="!data.canAddCourse" round @click="addCoursePost">确定添加</el-button>
      </div>
    </div>

  </el-dialog>
</template>

<script setup>
import {useCounterStore} from "@/store/counter";
import {computed, reactive} from "vue";

const store = useCounterStore();

function WeekOptionChild(value) {
  this.value = value;
  this.label = "第" + value + "周";
  this.children = [];
}

const data = reactive({
  weekOptions: computed(() => {
    let flag = 1;
    let options = [];
    for (let i = 1; i <= store.semesterConfig.max_week; i++, flag++) {
      if (i === 1) {
        options.push(new WeekOptionChild(i));
      }
      options[options.length - 1].children.push(new WeekOptionChild(i));
      if (flag >= 5) {
        let lastOption = options[options.length - 1];
        options[options.length - 1].label = `${lastOption.value}-${i}`;
        if (i + 1 <= store.semesterConfig.max_week) {
          options.push(new WeekOptionChild(i));
          flag = 0;
        }
      }
    }
    return options;
  }),
  timeBlockIndexes: [],
  weekSelected: [],
  selectedClassroom: undefined,
  props: {
    multiple: true,
  },
  canAddCourse: computed(() => {
    return !!(data.selectedClassroom);
  }),
});

const apiData = reactive({
  classrooms: null,
  dates: null,
});

const getClassroomData = () => {
  let _weeks = [];
  for (const weekSelectedElement of data.weekSelected) {
    _weeks.push(weekSelectedElement[1]);
  }
  let week_days = [];
  let which_lessons = [];
  for (const timeBlockIndex of data.timeBlockIndexes) {
    let _timeBlockData = timeBlockIndex.split(",");
    which_lessons.push(_timeBlockData[0]);
    week_days.push(_timeBlockData[1]);
  }
  let _url = `https://siae.top/course/advanced/api/classroom/?limit=100&week=${_weeks.join(",")}&what_day=${week_days.join(",")}&which_lesson=${which_lessons.join(",")}`;
  // console.log(_url);
  store.axiosMethod(_url,
      response => {
        if (response.data.results) {
          apiData.dates = response.data.dates;
          apiData.classrooms = response.data.results;
        }
      },
  );
};

const addCoursePost = () => {
  console.log("提交");
};
</script>

<style>
.TimeBlock {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.TimeBlockItem {
  width: 14%;
  border: black 1px solid;
  flex-wrap: wrap;
}

.TimeBlock .el-checkbox-button__inner {
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
</style>