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
            res.status(200).send({data: response.data, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})

router.get("/get-lesson", (req, res) => {
    const lesson_ID = req.query.lesson_ID;
    if(lesson_ID){
        getLesson(lesson_ID).then(lesson => {
            res.status(200).send({data: lesson.data, status: true})
        })
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})

router.post("/finish-lesson", (req, res) => {
    const user_course_ID = req.body.user_course_ID;
    const user_ID = req.body.user_ID;
    const lesson_ID = parseInt(req.body.lesson_ID);
    if(user_ID && lesson_ID && user_course_ID){
        vinculateLesson(user_ID, lesson_ID).then(response => {
            getOneUserCourse(user_course_ID).then(data => {
                let completed_porcent = 100/data.data.attributes.total_lessons;
                completed_porcent = completed_porcent + data.data.attributes.percentage;
                updatePercentage(completed_porcent, user_course_ID).then(response => {
                    getLesson(lesson_ID).then(lesson => {
                        res.status(200).send({data: lesson.data, status: true})
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