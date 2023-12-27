const express = require('express');
const { getCourseLessons, getCourses } = require('../apis/apiStrapi');
const router = express.Router();

router.post("/getCourseLessons", async (req,res) => {
    const course_ID = req.body.course_ID;
    if(course_ID){
        /*
        getCourseLessons(courseID).then(async (lessons) => {
            res.status(200).send({data: lessons, status: true})
        })*/
        getCourses().then(data => {
            const course = data.data.filter(item => item.attributes.course_ID === course_ID)
            res.status(200).send({data: course[0].attributes.lms_lessons.data, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/")

module.exports = router;