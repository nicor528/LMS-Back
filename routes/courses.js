const express = require('express');
const { createCourse, getCourses, vinculateCourse, finishCourse, getAllUserCourses, finishLesson } = require('../apis/apiStrapi');
const { verifyKey, setNewKey } = require('../apis/apiDynamoDB');
const router = express.Router();

router.post("/createCourse", async (req, res) => {
    console.log("test")
    const name = req.body.name;
    const description = req.body.description;
    const tech = req.body.tech;
    if(name && description && tech){
        createCourse().then().catch()
    }else{
        
    }
})

router.get("/getCourses", async (req, res) => {
    getCourses().then(courses => {
        res.status(200).send({data: courses.data, status: true})
    }).catch(error => {res.status(400).send({error, status: false})})
})

router.post("/addCourseToUser", async (req, res) => {
    const user_ID = req.body.user_ID;
    const course_ID = req.body.course_ID.toString();
    //const course_title = req.body.course_title;
    //const key = req.body.key;
    if(user_ID && course_ID){
        vinculateCourse(user_ID, course_ID).then(data => {
            const response = {
                ...data.data
            }
            res.status(200).send({data: response, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/finishCourse", async (req, res) => {
    const user_ID = req.body.user_ID;
    const course_ID = req.body.course_ID.toString();
    //const id = req.body.id;
    //const key = req.body.key;
    if(user_ID && course_ID){
        getAllUserCourses().then(data => {
            const allCourses = data.data.filter(data => data.attributes.user_ID === user_ID && data.attributes.course_ID === course_ID);
            finishLesson(allCourses[0].id, "finish").then(data => {
                res.status(200).send({data: data.data, status: true})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.get("/get-user-courses", (req, res) => {
    const user_ID = req.query.user_ID;
    if(user_ID){
        getAllUserCourses().then(data => {
            const allCourses = data.data.filter(data => data.attributes.user_ID === user_ID)
            getCourses().then(data => {
                let newCourses = []
                const courses = data.data;
                allCourses.map(item => {
                    const course = courses.find(course => course.attributes.courseID === item.attributes.course_ID)
                    item.attributes.course_name = course.attributes.technology;
                    item.attributes.level = course.attributes.level;
                    newCourses.push(item);
                })
                res.status(200).send({data: newCourses, status: true})
            }).catch(error => console.log(error))
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing ID", status: false})
    }
})

router.post("/finish-lesson", (req, res) => {
    const user_ID = req.body.user_ID;
    const course_ID = req.body.course_ID;
    const lesson_number = req.body.lesson_number.toString();
    if(user_ID && course_ID && lesson_number){
        getAllUserCourses().then(data => {
            const allCourses = data.data.filter(data => data.attributes.user_ID === user_ID && data.attributes.course_ID === course_ID);
            //const user_course = allCourses.find(item => item.attributes.courseID === course_ID);
            finishLesson(allCourses[0].id, lesson_number).then(data => {
                res.status(200).send({data: data.data, status: true})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})




module.exports = router;