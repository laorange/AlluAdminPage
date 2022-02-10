<template>
  <h1 v-if="!tableData">本学期该年级的培养方案为空</h1>
  <table v-if="tableData">
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
        <td v-if="item.info" :rowspan="item.rowSpan" v-right-click:[item._data]="menuHandle.courseInfo()">{{ item.info }}</td>

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
      <td v-for="(_week, _index) in item.weekRecord" :key="_index" class="WeekCol">{{ item._data.plan_id ? _week : " " }}</td>
    </tr>
  </table>
</template>

<script setup>
import {defineProps} from "vue";

const props = defineProps({
  tableData: {
    type: Array,
    required: true,
  },
  useMenu: {
    type: Boolean,
    // Object or array defaults must be returned from a factory function
    default() {
      return false;
    },
  },
});

const menuHandle = {
  // 右键菜单对象，菜单内容和处理事件
  courseInfo() {
    return {
      this: this,
      text: [
        "编辑课程信息",
        "新增理论课教学计划",
        "新增习题课教学计划",
        "新增实验课教学计划",
        "新增考试计划",
        "取消",
      ],
      handler: {
        editInfo(context) {
          console.log(context);
          console.log("编辑课程信息");
          window.location.href = `/admin/course/courseplan/${context.info_id}/change/`;
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
          //  TODO: 对话框
        },
        _cancel() {
          console.log("取消");
        },
      },
    };
  },
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
</style>