<template>
  <h1>PDC</h1>

  <div class="PdcHeader">
    <div>
      <el-tooltip class="box-item" effect="dark" content="从2007.9起始的第?学期" placement="top">学期戳：</el-tooltip>
      <el-tooltip class="box-item" effect="dark" :content="get_period_display(data.period)" placement="top">
        <el-input-number v-model="data.period" :min="30" @change="handlePeriodChange"/>
      </el-tooltip>
    </div>
    <div>
      <el-select v-model="data.semester" class="m-2" placeholder="选择年级">
        <el-option v-for="item in data.semesterOptions" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>

  <pdc-table :tableData="tableData"></pdc-table>

</template>

<script setup>
import {
  reactive,
  computed,
} from "vue";

import PdcTable from "./PdcTable";

let semesterConfig = {
  "current_period": 30,
  "current_period_display": "2022.02~2022.07",
  "week1_monday_date": "2022-02-28 00:00:00",
  "max_week": 20,
};

const data = reactive({
  period: 30,
  semester: null,
  CourseInfo2d: [{
    "info_id": 9,
    "type": {
      "type_id": 1,
      "name": "未分类",
      "color": "ffffff",
    },
    "period": 30,
    "semester": 2,
    "code": "09402002",
    "ch_name": "体育（2）",
    "en_name": "",
    "fr_name": null,
    "info_plan": [],
  },
    {
      "info_id": 10,
      "type": {
        "type_id": 1,
        "name": "未分类",
        "color": "ffffff",
      },
      "period": 30,
      "semester": 2,
      "code": "16402004",
      "ch_name": "思想道德修养与法律基础及实践",
      "en_name": "",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 11,
      "type": {
        "type_id": 1,
        "name": "未分类",
        "color": "ffffff",
      },
      "period": 30,
      "semester": 2,
      "code": "52401002",
      "ch_name": "军事理论",
      "en_name": "",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 12,
      "type": {
        "type_id": 2,
        "name": "预科数学",
        "color": "CCFFFF",
      },
      "period": 30,
      "semester": 2,
      "code": "60411121",
      "ch_name": "高等数学（2）",
      "en_name": "Advanced Mathematics II",
      "fr_name": null,
      "info_plan": [{
        "plan_id": 1,
        "teacher": {
          "teacher_id": 6,
          "name": "关静",
          "slug": "guan-jing",
          "validity": true,
        },
        "info": {
          "info_id": 12,
          "period": 30,
          "semester": 2,
          "code": "60411121",
          "ch_name": "高等数学（2）",
          "en_name": "Advanced Mathematics II",
          "fr_name": null,
          "type": 2,
        },
        "groups": [{
          "group_id": 25,
          "period": 30,
          "semester": 2,
          "name": "AB班",
        }],
        "method": "Course",
        "plan_course": [{
          "course_id": 1,
          "date": "2022-01-27",
          "which_lesson": 1,
          "note": null,
          "update_time": "2022-01-27T11:37:49.966067",
          "plan": 1,
          "room": 3,
        },
          {
            "course_id": 2,
            "date": "2022-03-01",
            "which_lesson": 4,
            "note": null,
            "update_time": "2022-01-27T11:38:09.539304",
            "plan": 1,
            "room": 4,
          },
          {
            "course_id": 3,
            "date": "2022-02-15",
            "which_lesson": 1,
            "note": null,
            "update_time": "2022-02-06T15:31:19.925450",
            "plan": 1,
            "room": 3,
          },
        ],
      }],
    },
    {
      "info_id": 13,
      "type": {
        "type_id": 3,
        "name": "预科物理化学",
        "color": "FFFF99",
      },
      "period": 30,
      "semester": 2,
      "code": "60411221",
      "ch_name": "基础物理（2）",
      "en_name": "Fundamental Physics （2）",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 14,
      "type": {
        "type_id": 4,
        "name": "预科法语",
        "color": "ffffff",
      },
      "period": 30,
      "semester": 2,
      "code": "60411323",
      "ch_name": "基础法语（2）",
      "en_name": "Basic French 2",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 15,
      "type": {
        "type_id": 5,
        "name": "预科英语",
        "color": "FF99CC",
      },
      "period": 30,
      "semester": 2,
      "code": "60411324",
      "ch_name": "大学英语（2）",
      "en_name": "College English 2",
      "fr_name": null,
      "info_plan": [{
        "plan_id": 2,
        "teacher": {
          "teacher_id": 9,
          "name": "刘成盼",
          "slug": "liu-cheng-pan",
          "validity": true,
        },
        "info": {
          "info_id": 15,
          "period": 30,
          "semester": 2,
          "code": "60411324",
          "ch_name": "大学英语（2）",
          "en_name": "College English 2",
          "fr_name": null,
          "type": 5,
        },
        "groups": [{
          "group_id": 31,
          "period": 30,
          "semester": 2,
          "name": "PA",
        },
          {
            "group_id": 33,
            "period": 30,
            "semester": 2,
            "name": "PB",
          },
        ],
        "method": "Course",
        "plan_course": [{
          "course_id": 4,
          "date": "2022-02-08",
          "which_lesson": 2,
          "note": null,
          "update_time": "2022-02-08T11:54:35.764337",
          "plan": 2,
          "room": 10,
        }],
      },
        {
          "plan_id": 3,
          "teacher": {
            "teacher_id": 8,
            "name": "刘东亮",
            "slug": "liu-dong-liang",
            "validity": true,
          },
          "info": {
            "info_id": 15,
            "period": 30,
            "semester": 2,
            "code": "60411324",
            "ch_name": "大学英语（2）",
            "en_name": "College English 2",
            "fr_name": null,
            "type": 5,
          },
          "groups": [{
            "group_id": 35,
            "period": 30,
            "semester": 2,
            "name": "PC",
          },
            {
              "group_id": 37,
              "period": 30,
              "semester": 2,
              "name": "PD",
            },
          ],
          "method": "Course",
          "plan_course": [{
            "course_id": 5,
            "date": "2022-02-08",
            "which_lesson": 5,
            "note": null,
            "update_time": "2022-02-08T11:55:43.966475",
            "plan": 3,
            "room": 6,
          }],
        },
      ],
    },
    {
      "info_id": 16,
      "type": {
        "type_id": 4,
        "name": "预科法语",
        "color": "ffffff",
      },
      "period": 30,
      "semester": 2,
      "code": "60411325",
      "ch_name": "科技法语",
      "en_name": "Scientific French",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 17,
      "type": {
        "type_id": 1,
        "name": "未分类",
        "color": "ffffff",
      },
      "period": 30,
      "semester": 2,
      "code": "60411501",
      "ch_name": "大学美育",
      "en_name": "",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 18,
      "type": {
        "type_id": 1,
        "name": "未分类",
        "color": "ffffff",
      },
      "period": 30,
      "semester": 2,
      "code": "",
      "ch_name": "形势与政策（1）",
      "en_name": "",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 28,
      "type": {
        "type_id": 1,
        "name": "未分类",
        "color": "ffffff",
      },
      "period": 30,
      "semester": 4,
      "code": "09402004",
      "ch_name": "体育（4）",
      "en_name": "",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 29,
      "type": {
        "type_id": 1,
        "name": "未分类",
        "color": "ffffff",
      },
      "period": 30,
      "semester": 4,
      "code": "16402002",
      "ch_name": "马克思主义基本原理概论及实践",
      "en_name": "",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 30,
      "type": {
        "type_id": 1,
        "name": "未分类",
        "color": "ffffff",
      },
      "period": 30,
      "semester": 4,
      "code": "16402003",
      "ch_name": "毛泽东思想和中国特色社会主义理论体系概论（2）",
      "en_name": "",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 31,
      "type": {
        "type_id": 2,
        "name": "预科数学",
        "color": "CCFFFF",
      },
      "period": 30,
      "semester": 4,
      "code": "60411123",
      "ch_name": "高等数学（4）",
      "en_name": "Advanced Mathematics IV",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 32,
      "type": {
        "type_id": 3,
        "name": "预科物理化学",
        "color": "FFFF99",
      },
      "period": 30,
      "semester": 4,
      "code": "60411223",
      "ch_name": "普通物理（下）",
      "en_name": "General physics (2)",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 33,
      "type": {
        "type_id": 3,
        "name": "预科物理化学",
        "color": "FFFF99",
      },
      "period": 30,
      "semester": 4,
      "code": "60411227",
      "ch_name": "化学（2）",
      "en_name": "Chemistry (2)",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 34,
      "type": {
        "type_id": 4,
        "name": "预科法语",
        "color": "ffffff",
      },
      "period": 30,
      "semester": 4,
      "code": "60411328",
      "ch_name": "中级法语（2）",
      "en_name": "Intermediate French 2",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 35,
      "type": {
        "type_id": 5,
        "name": "预科英语",
        "color": "FF99CC",
      },
      "period": 30,
      "semester": 4,
      "code": "60411329",
      "ch_name": "大学英语（4）",
      "en_name": "College English 4",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 36,
      "type": {
        "type_id": 1,
        "name": "未分类",
        "color": "ffffff",
      },
      "period": 30,
      "semester": 4,
      "code": "60413216",
      "ch_name": "电子电工实验",
      "en_name": "Electric and Electronic Experiments",
      "fr_name": null,
      "info_plan": [],
    },
    {
      "info_id": 37,
      "type": {
        "type_id": 1,
        "name": "未分类",
        "color": "ffffff",
      },
      "period": 30,
      "semester": 4,
      "code": "",
      "ch_name": "形势与政策（2）",
      "en_name": "",
      "fr_name": null,
      "info_plan": [],
    },
  ],
});

const getItemData = (info, color = "ffffff", method = "暂无教学计划", teacher = "-", group = "-") => {
  return {
    info: info,
    method: method,
    teacher: teacher,
    groups: group,
    rowSpan: 1,
    color: color,
    weekRecord: Array(semesterConfig.max_week).fill(0),
  };
};

const tableData = computed(() => {
  console.log("TableData");
  let cookedData = [];

  for (let info of data.CourseInfo2d) {
    let itemData = getItemData(info.ch_name, info.type.color);
    if (info.info_plan.length === 0) {
      cookedData.push(itemData);
    } else {
      itemData.rowSpan = info.info_plan.length;
      for (let planIndex in info.info_plan) {
        let plan = info.info_plan[planIndex];
        if (planIndex !== "0") {
          // console.log("planIndex", planIndex);
          itemData.info = null;
        }
        itemData.method = plan.method;
        itemData.teacher = plan.teacher.name;
        if (plan.groups.length !== 0) {
          let _groups = [];
          for (let _group of plan.groups) {
            _groups.push(_group.name);
          }
          itemData.groups = _groups.join("&");
          if (plan.plan_course.length !== 0) {
            for (const planCourseElement of plan.plan_course) {
              let _week = parseInt((new Date(planCourseElement.date) - new Date(semesterConfig.week1_monday_date)) / 604800000 + 5);
              console.log("_week", _week);
              if (0 <= _week < semesterConfig.max_week) {
                console.log("itemData.weekRecord[_week]", itemData.weekRecord[_week]);
                itemData.weekRecord[_week] += 2;
              }
            }
          }
          cookedData.push(JSON.parse(JSON.stringify(itemData)));
        }
      }
    }
  }
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

data.semesterOptions = computed(() => {
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

const handlePeriodChange = (value) => {
  data.semester = null;
};
</script>

<style scoped>
.PdcHeader {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.PdcHeader div {
  margin: 5px;
}

.TableHead {
  margin-top: 1.5rem;
}

.TableHead,
.TableBody {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
  width: 100%;
  height: auto;
  font-size: 10px;
}

.TableHeadItem,
.TableBodyItem {
  flex: 1;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  border: black solid 1px;
}
</style>
