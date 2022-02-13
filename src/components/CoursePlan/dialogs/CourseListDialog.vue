<template>
  <el-dialog v-model="store.CourseListDialogData.ifShow"
             :title="`第 ${store.CourseListDialogData.week} 周`" :fullscreen="true">
    <div class="dialogBody">
      <div class="TimeBlock">
        <div class="TimeBlockHead">星期一</div>
        <div class="TimeBlockHead">星期二</div>
        <div class="TimeBlockHead">星期三</div>
        <div class="TimeBlockHead">星期四</div>
        <div class="TimeBlockHead">星期五</div>
        <div class="TimeBlockHead">星期六</div>
        <div class="TimeBlockHead">星期日</div>

        <template v-for="row in 5" :key="row">
          <template v-for="col in 7" :key="col">
            <div class="TimeBlockItem">
              <div class="CourseCard" v-for="course in getData[`${row},${col}`]"
                   :key="course.course_id" :style="{backgroundColor: '#' + course.color}">
                <!--                <div>row:{{ row }},col:{{ col }}</div>-->
                <div v-show="course.ch_name">{{ course.ch_name }}</div>
                <div v-show="course.en_name">{{ course.en_name }}</div>
                <div v-show="course.fr_name">{{ course.fr_name }}</div>
                <div v-show="course.date">{{ course.date }}</div>
                <div v-show="course.method">{{ course.method }}</div>
                <div v-show="course.teacher">{{ course.teacher }}</div>
                <div v-show="course.groups">{{ course.groups }}</div>
                <div v-show="course.room">{{ course.room }}</div>
                <!--                <div>which_lesson: {{ course.data.which_lesson }}</div>-->
                <!--                <div>what_day: {{ course.what_day }}</div>-->
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </el-dialog>
</template>


<script setup>
import {useCounterStore} from "@/store/counter";
import {computed, reactive} from "vue";

const store = useCounterStore();

function Course(_data) {
  this.data = _data;
  this.course_id = _data.course_id;
  this.date = _data.date;
  this.ch_name = _data.plan.info.ch_name;
  this.en_name = _data.plan.info.en_name;
  this.fr_name = _data.plan.info.fr_name;
  this.method = _data.plan.method;
  this.color = _data.plan.info.type.color;
  this.teacher = _data.plan.teacher.name;
  this.note = _data.note;
  let _groups = [];
  for (let _group of _data.plan.groups) {
    _groups.push(_group.name);
  }
  this.groups = _groups.join("&");
  this.room = _data.room.name;
  this.what_day = (new Date(_data.date)).getDay();
  this.which_lesson = _data.which_lesson;
}

const getData = computed(() => {
  let data = [];
  for (let i = 1; i < 6; i++) {
    for (let j = 1; j < 8; j++) {
      data[`${i},${j}`] = [];
    }
  }
  for (const courseData of store.CourseListDialogData.courses) {
    let _course = new Course(courseData);
    let timeBlockIndex = `${_course.which_lesson},${_course.what_day}`;
    data[timeBlockIndex].push(_course);
  }
  console.log("courses", data);
  return data;
});

// function Course(_data) {
//   this.data = _data;
//   this.course_id = _data.course_id;
//   this.ch_name = _data.plan.info.ch_name;
//   this.en_name = _data.plan.info.en_name;
//   this.fr_name = _data.plan.info.fr_name;
//   this.method = _data.plan.method;
//   this.color = _data.plan.info.type.color;
//   this.teacher = _data.plan.teacher.name;
//   let _groups = [];
//   for (let _group of _data.plan.groups) {
//     _groups.push(_group.name);
//   }
//   this.groups = _groups.join("&");
//   this.room = _data.room.name;
//   this.what_day = (new Date(_data.update_time)).getDay() + 1;
//   this.which_lesson = _data.which_lesson;
// }
//
// watch(() => store.CourseListDialogData.courses, () => {
//   data.courses = [];
//   for (const courseData of store.CourseListDialogData.courses) {
//     let _course = new Course(courseData);
//     let timeBlockIndex = `${_course.which_lesson},${_course.what_day}`;
//     if (!data.courses[timeBlockIndex]) {
//       data.courses[timeBlockIndex] = [];
//     }
//     data.courses[timeBlockIndex].push(_course);
//   }
// });
</script>

<style scoped>
.TimeBlock {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: black;
}

.TimeBlockHead, .TimeBlockItem {
  width: 14%;
  border: black 1px solid;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  overflow: auto;
}

.TimeBlockItem {
  height: 150px;
}

.CourseCard {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}
</style>