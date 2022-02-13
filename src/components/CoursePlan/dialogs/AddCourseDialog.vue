<template>
  <el-dialog v-model="store.AddCourseDialogData.ifShow" :title="store.AddCourseDialogTitle"
             :fullscreen="false" width="90%">
    <div class="dialogBody">
      <!-- region 表格 -->
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
      <!-- endregion 表格 -->

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
import {computed, reactive, watch} from "vue";
import axios from "axios";
import getUrl from "@/assets/urls";

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
  timeBlocks: null,
});

const storeData = reactive({
  period: computed(() => store.period),
  semester: computed(() => store.semester),
});

const getClassroomData = () => {
  let _weeks = [];
  for (const weekSelectedElement of data.weekSelected) {
    _weeks.push(weekSelectedElement[1]);
  }
  let what_days = [];
  let which_lessons = [];
  for (const timeBlockIndex of data.timeBlockIndexes) {
    let _timeBlockData = timeBlockIndex.split(",");
    which_lessons.push(_timeBlockData[0]);
    what_days.push(_timeBlockData[1]);
  }
  let _url = getUrl.advancedApiClassroom(_weeks, what_days, which_lessons);
  store.axiosMethod(_url,
      response => {
        if (response.data.results) {
          apiData.timeBlocks = response.data.timeBlocks;
          apiData.classrooms = response.data.results;
        }
      },
  );
};

const addCoursePost = () => {
  function post(data, callbackFunction = (response) => {
    console.log(response);
  }) {
    axios.post(getUrl.courseForPost(), data).then(
        response => {
          callbackFunction(response);
        },
        error => {
          console.warn(error.message);
        },
    );
  }

  for (const timeBlockIndex in apiData.timeBlocks) {
    let timeBlock = apiData.timeBlocks[timeBlockIndex];
    let callbackFunction = timeBlockIndex === apiData.timeBlocks.length - 1 ? () => {
      store.myReset();
    } : undefined;
    post({
      plan: store.AddCourseDialogData.plan_id, room: data.selectedClassroom,
      date: timeBlock.date, which_lesson: timeBlock.which_lesson,
    }, callbackFunction);
  }
  store.myReset();
};

watch(storeData, (newData) => {
  localStorage.setItem("period", "" + newData.period);
  localStorage.setItem("semester", "" + newData.semester);
}, {deep: true});

watch(() => data.weekSelected, () => {
  apiData.classrooms = null;
  apiData.timeBlocks = null;
}, {deep: true});

watch(() => data.timeBlockIndexes, () => {
  apiData.classrooms = null;
  apiData.timeBlocks = null;
}, {deep: true});
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