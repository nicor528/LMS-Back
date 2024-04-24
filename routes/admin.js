const express = require('express');
const { getOpenRequests, aproveUserCourseRequest, getCloseRequests } = require('../apis/apiFirebase');
const { getAllUsers, getCourses, getOneCourse1, vinculateCourse } = require('../apis/apiStrapi');
const router = express.Router();

router.get("/get-open-user-courses-requests", (req, res) => {
    getOpenRequests().then(data => {
        res.status(200).send({data: data, status: true})
    }).catch(error => {res.status(400).send({error, status: false})})
})

router.get("/get-cloed-user-course-request", (req, res) => {
    getCloseRequests().then(data => {
        res.status(200).send({data: data, status: true})
    }).catch(error => {res.status(400).send({error, status: false})})
})

router.post("/aprove-or-denied-user-course-request", (req, res) => {
    const user_ID = req.body.user_ID;
    const course_ID = req.body.course_ID;
    const aproved = req.body.aproved;
    if(course_ID && user_ID && (aproved == true || aproved == false)){
        aproveUserCourseRequest(user_ID + course_ID, aproved).then(data => {
            if(aproved == true) {
                getCourses().then(courses => {
                    const Course = courses.data.filter(item => item.id === parseInt(course_ID));
                    let n_lessons = 0; 
                    getOneCourse1(Course[0].id).then(course => {
                        console.log(course)
                        course.data.attributes.lms_modules.data.map(item => {
                            console.log(item)
                            item.attributes.lms_lessons.data.map(item => {
                                n_lessons ++;
                            })
                        })
                        console.log(n_lessons)
                        vinculateCourse(user_ID, course_ID, Course[0], n_lessons).then(data => {
                            getOpenRequests().then(data => {
                                res.status(200).send({data: data, status: true})
                            }).catch(error => {res.status(400).send({error, status: false})})
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }else{
                getOpenRequests().then(data => {
                    res.status(200).send({data: data, status: true})
                }).catch(error => {res.status(400).send({error, status: false})})
            }
        })
    }else{
        res.status(401).send({message: "Missing data", status: false})
    }
})

router.get("/get-all-users", (req, res) => {
    getAllUsers().then(users => {
        res.status(200).send({data: users.data, status: true})
    }).catch(error => {res.status(400).send({error, status: false})})
})




module.exports = router;