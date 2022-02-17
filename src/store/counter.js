// stores/counter.js
import {defineStore} from "pinia";
import axios from "axios";

export const useCounterStore = defineStore("counter", {
    state: () => {
        return {
            isLoading: false,
            period: undefined,
            semester: undefined,
            semesterConfig: {
                "current_period": 30,
                "current_period_display": "2022.02~2022.07",
                "week1_monday_date": "2022-02-28 00:00:00",
                "max_week": 20,
            },
            courseInfo3d: [],
            AddCourseDialogData: {
                ifShow: false,
                plan: undefined,
                plan_id: undefined,
            },
            CourseListDialogData: {
                ifShow: false,
                week: undefined,
                plan_id: undefined,
                courses: [],
            },
        };
    },
    getters: {
        AddCourseDialogTitle(state) {
            if (state.AddCourseDialogData.plan && state.AddCourseDialogData.plan_id) {
                let plan = state.AddCourseDialogData.plan;
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
                return "教学计划";
            }
        },
    },
    actions: {
        onMountedHook() {
            this.axiosMethod("https://siae.top/course/api/SemesterConfig/", (response) => {
                if (response.data.results) {
                    this.semesterConfig = response.data.results[0];
                    this.period = parseInt(localStorage.getItem("period")) || this.semesterConfig.current_period;
                    this.semester = parseInt(localStorage.getItem("semester")) || (2 - this.semesterConfig.current_period % 2);
                    this.addCourseInfoData(undefined, true);
                }
            });
        },
        addCourseInfoData(url = `https://siae.top/course/api/CourseInfo3d/?period=${this.period}&semester=${this.semester}`,
                          clearOldData = false) {
            if (clearOldData) {
                this.courseInfo3d = [];
            }
            this.axiosMethod(url, response => {
                if (response.data.results) {
                    for (const courseInfo of response.data.results) {
                        this.courseInfo3d.push(courseInfo);
                    }
                }
                if (response.data.next) {
                    this.addCourseInfoData(response.data.next);
                }
            });
        },
        getDataAndShowCourseListDialog(plan_id, week) {
            let _this = this;

            function addCourseToData(url = `https://siae.top/course/api/Course2d/?plan=${_this.CourseListDialogData.plan_id}&week=${_this.CourseListDialogData.week}`) {
                _this.axiosMethod(url, response => {
                    if (response.data.results) {
                        for (const courseInfo of response.data.results) {
                            _this.CourseListDialogData.courses.push(courseInfo);
                        }
                    }
                    if (response.data.next) {
                        addCourseToData(response.data.next);
                    }
                });
            }

            if (week > 0) {
                _this.CourseListDialogData.courses = [];
                this.CourseListDialogData.ifShow = true;
                this.CourseListDialogData.week = week;
                this.CourseListDialogData.plan_id = plan_id;
                addCourseToData();
            }
        },
        axiosMethod(url, handler) {
            this.isLoading = true;
            axios.get(url).then(
                response => {
                    handler(response);
                    this.isLoading = false;
                },
                error => {
                    console.warn(error.message);
                    this.isLoading = false;
                },
            );
        },
        myReset() {
            this.$reset()
            this.onMountedHook();
        },
    },
});
