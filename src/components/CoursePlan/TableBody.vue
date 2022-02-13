<template>
  <h1 v-if="!tableData.length">本学期该年级的培养方案为空</h1>
  <table v-if="tableData.length">
    <tr>
      <th>课程名</th>
      <th>类型</th>
      <th>授课教师</th>
      <th>分组</th>
      <th class="WeekCol">𝚺</th>
      <th class="WeekCol" v-for="week in store.semesterConfig.max_week" :key="week">{{ week }}</th>
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
      <template v-for="(_CourseHourInThisWeek, _index) in item.weekRecord" :key="_index">
        <!--        <td v-if="_CourseHourInThisWeek" @dblclick="showCourseListDialog(item._data.plan_id, _index)">-->
        <td v-if="_CourseHourInThisWeek" @dblclick="store.getDataAndShowCourseListDialog(item._data.plan_id, _index)">
          {{ _CourseHourInThisWeek }}
        </td>
        <td v-else></td>
      </template>
    </tr>
  </table>
</template>

<script setup>
import {computed, defineProps} from "vue";
import {useCounterStore} from "@/store/counter";

const store = useCounterStore();

const props = defineProps({
  useMenu: {
    type: Boolean,
    // Object or array defaults must be returned from a factory function
    default() {
      return false;
    },
  },
});

function OnePdcData(data = null, info = "课程信息", color = "ffffff", method = null, teacher = "", group = "") {
  this.info = info;
  this.method = method;
  this.teacher = teacher;
  this.groups = group;
  this.rowSpan = 1;
  this.color = color;
  this.weekRecord = (new Array(store.semesterConfig.max_week + 1)).fill(0);
  this._data = data;
}

const tableData = computed(() => {
  let cookedData = [];

  for (let info of store.courseInfo3d) {
    let onePdc = new OnePdcData(info, info.ch_name, info.type.color);

    //如果该CourseInfo名下没有PDC，则直接添加
    if (info.info_plan.length === 0) {
      cookedData.push(onePdc);
    } else {
      onePdc.rowSpan = info.info_plan.length;
      for (let planIndex in info.info_plan) {
        onePdc.weekRecord.fill(0); //初始化每个PDC的课时统计
        let plan = info.info_plan[planIndex];
        if (planIndex !== "0") {
          onePdc.info = null;   //对多plan的CourseInfo的课程名置空
        }
        onePdc.method = plan.method;
        onePdc.teacher = plan.teacher.name;
        if (plan.groups.length !== 0) {
          onePdc._data.plan_id = plan.plan_id;
          onePdc._data.plan = plan;
          let _groups = [];
          for (let _group of plan.groups) {
            _groups.push(_group.name);
          }
          onePdc.groups = _groups.join("&");
          if (plan.plan_course.length !== 0) {
            for (const planCourseElement of plan.plan_course) {
              let _week = parseInt(
                  (new Date(planCourseElement.date) - new Date(store.semesterConfig.week1_monday_date)) / 604800000 + 1,
              );
              if (0 <= _week < store.semesterConfig.max_week) {
                onePdc.weekRecord[_week] += 2;
              }
            }
            onePdc.weekRecord[0] = eval(onePdc.weekRecord.join("+"));  //数组第一位为课时总和
          }
          cookedData.push(JSON.parse(JSON.stringify(onePdc)));
        }
      }
    }
  }
  //endregion

  return cookedData;
});

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
          store.AddCourseDialogData.ifShow = true;
          store.AddCourseDialogData.plan_id = context.plan_id;
          store.AddCourseDialogData.plan = context.plan;
        },
        _cancel() {
          console.log("取消");
        },
      },
    };
  },
};

const showCourseListDialog = (plan_id, week) => {
  if (week >= 1) {
    console.log(plan_id, week);
    store.getDataAndShowCourseListDialog(plan_id, week);
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

/*右键菜单的样式 强制调整*/
.right-menu ul li {
  padding: 0 !important;
  border-bottom: none !important;
}

.ClassroomSelector > * {
  margin-left: 20px;
}
</style>