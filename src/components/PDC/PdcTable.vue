<template>
  <table>
    <tr>
      <th>课程名</th>
      <th>method</th>
      <th>teacher</th>
      <th>groups</th>
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
      <td v-if="item.info" :rowspan="item.rowSpan">{{ item.info }}</td>
      <td>{{ item.method }}</td>
      <td>{{ item.teacher }}</td>
      <td>{{ item.groups }}</td>
      <td v-for="(_week, _index) in item.weekRecord" :key="_index" class="WeekCol">{{ _week }}</td>
    </tr>
  </table>
</template>

<script setup>
import {defineProps} from "vue";

const props = defineProps({
  tableData: Array,
});
</script>

<style scoped>
table {
  /*display: flex;*/
  width: 100%;
}

tr, th, td {
  border: black solid 1px;
}

.WeekCol {
  width: 20px;
}
</style>