<template>
  <loading-mask></loading-mask>

  <div class="PdcHeader">
    <header>
      <grade-selector></grade-selector>
    </header>
  </div>

  <main>
    <table-body :use-menu="true"></table-body>
  </main>

  <add-course-dialog></add-course-dialog>
  <course-list-dialog></course-list-dialog>

</template>

<script setup>
import {onMounted} from "vue";

import GradeSelector from "./CoursePlan/GradeSelector";
import LoadingMask from "./LoadingMask";

import TableBody from "./CoursePlan/TableBody";
import AddCourseDialog from "./CoursePlan/dialogs/AddCourseDialog";
import CourseListDialog from "./CoursePlan/dialogs/CourseListDialog";
import {useCounterStore} from "@/store/counter";

const store = useCounterStore();

onMounted(() => {
  store.onMountedHook();
});

</script>

<style scoped>

</style>