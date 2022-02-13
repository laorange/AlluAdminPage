export default {
    advancedApiClassroom(weeks, what_days, which_lessons){
        return `https://siae.top/course/advanced/api/classroom/?limit=100&week=${weeks.join(",")}&what_day=${what_days.join(",")}&which_lesson=${which_lessons.join(",")}`;
    },
    courseForPost(){
        return `https://siae.top/course/api/CourseForPost/`
    },
    courseChangePage(course_id) {
        return `https://siae.top/admin/course/course/${course_id}/change/`
    },
    courseInfoChangePage(info_id) {
        return `https://siae.top/admin/course/courseinfo/${info_id}/change/`
    },
    coursePlanAddPage(info_id, method = "Course") {
        return `https://siae.top/admin/course/courseplan/add/?info=${info_id}&method=${method}`
    },
}