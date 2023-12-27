const express = require('express');
const { getAllUserCourses, getCourses } = require('../apis/apiStrapi');
const router = express.Router();

router.get("/home-page", (req, res) => {
    const user_ID = req.body.user_ID;
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
                
            }).catch(error => console.log(error))
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing ID", status: false})
    }
})

module.exports = router;