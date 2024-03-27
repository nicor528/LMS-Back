const express = require('express');
const { getCourseLessons, getCourses, vinculateLesson, vinculateModule, getModule, getLesson, getOneUserCourse, updatePercentage } = require('../apis/apiStrapi');
const router = express.Router();

/*
router.get("/getCourseLessons", async (req,res) => {
    const lesson_ID = parseInt(req.query.lesson_ID);
    if(lesson_ID){
        /*
        getCourseLessons(courseID).then(async (lessons) => {
            res.status(200).send({data: lessons, status: true})
        })*/
        /*getCourses().then(async (data) => {
            const course = await data.data.filter(item => item.attributes.courseID === course_ID)
            //console.log(course[0])
            res.status(200).send({data: course[0].attributes.lms_lessons.data, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})*/

router.get("/get-module", (req, res) => {
    const module_ID = req.query.module_ID;
    const user_ID = req.query.user_ID;
    if(module_ID && user_ID){
        getModule(module_ID).then(async (module) => {
            let module1 = module;
            const finish = await module1.data.attributes.lms_users.data.find(user => user.attributes.user_ID == user_ID)
            if(finish){
                module1.data.attributes.finish = await true;
                module1.data.attributes.lms_users = await [];
                res.status(200).send({data: module1.data, status: true})
            }else{
                module1.data.attributes.finish = await false;
                module1.data.attributes.lms_users = await [];
                res.status(200).send({data: module1.data, status: true})
            }
        }).catch(error => {res.status(400).send({error, status: false})})
    }
    if(module_ID){
        getModule(module_ID).then(response => {
            res.status(200).send({data: response.data, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data", status: false})
    }
})

router.post("/finish-module", (req, res) => {
    const user_ID = req.body.user_ID;
    const module_ID = parseInt(req.body.module_ID);
    if(user_ID && module_ID){
        vinculateModule(user_ID, module_ID).then(response => {
            getModule(module_ID).then(async (module) => {
                let module1 = module;
                module1.data.attributes.finish = await true;
                module1.data.attributes.lms_users = await [];
                res.status(200).send({data: module1.data, status: true})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})

router.get("/get-lesson", (req, res) => {
    const lesson_ID = req.query.lesson_ID;
    const user_ID = req.query.user_ID;
    if(lesson_ID && user_ID){
        getLesson(lesson_ID).then(async (lesson) => {
            let lesson1 = lesson;
            console.log(lesson1)
            const finish = await lesson1.data.attributes.lms_users.data.find(user => user.attributes.user_ID == user_ID);
            console.log(finish)
            if(finish){
                lesson1.data.attributes.finish = await true;
                lesson1.data.attributes.lms_users = await [];
                res.status(200).send({data: lesson1.data, status: true})
            }else{
                lesson1.data.attributes.finish = await false;
                lesson1.data.attributes.lms_users = await [];
                res.status(200).send({data: lesson1.data, status: true})
            }
        }).catch(error => {res.status(400).send({error, status: false})})
    }if(lesson_ID){
        getLesson(lesson_ID).then(lesson => {
            res.status(200).send({data: lesson.data, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})

router.post("/finish-lesson", (req, res) => {
    const course_ID = req.body.course_ID;
    const user_ID = req.body.user_ID;
    const lesson_ID = parseInt(req.body.lesson_ID);
    if(user_ID && lesson_ID && user_course_ID){
        vinculateLesson(user_ID, lesson_ID).then(response => {
            getAllUserCourses().then(data => {
                const allCourses = data.data.filter(data => data.attributes.user_ID === user_ID && (data.attributes.lms_course.data.id === course_ID || data.id === course_ID ));
                const course = allCourses[0]
                let completed_porcent = 100/course.attributes.total_lessons;
                completed_porcent = completed_porcent + course.attributes.percentage;
                updatePercentage(completed_porcent, user_course_ID).then(response => {
                    getLesson(lesson_ID).then(async (lesson) => {
                        let lesson1 = lesson;
                        lesson1.data.attributes.finish = await true;
                        lesson1.data.attributes.lms_users = await [];
                        res.status(200).send({data: lesson1.data, status: true})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})


/*
router.post("/finish-lesson", (req, res) => {
    const user_ID = req.body.user_ID;
    const lesson_ID = parseInt(req.body.lesson_ID);
    if(user_ID && lesson_ID){
        vinculateLesson(user_ID, lesson_ID).then(response => {
            res.status(200).send({data: response.data, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})*/

module.exports = router;