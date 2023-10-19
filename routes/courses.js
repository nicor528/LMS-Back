const express = require('express');
const { createCourse, getCourses, vinculateCourse, finishCourse } = require('../apis/apiStrapi');
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
    const userID = req.body.userID;
    const courseID = req.body.courseID;
    const key = req.body.key;
    if(userID && courseID && key){
        verifyKey(userID, key).then(newKey => {
            //setNewKey(userID, newKey).then(data => {
                vinculateCourse(userID, courseID).then(data => {
                    const response = {
                        ...data.data
                    }
                    res.status(200).send({data: response, status: true})
                }).catch(error => {res.status(400).send({error, status: false})})
            //}).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {
            console.log(error)
            if(error == 1){
                res.status(400).send({message: "bad key", error, status: false})
            }else{
                res.status(400).send({error, status: false})
            }
        })
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/finishCourse", async (req, res) => {
    const userID = req.body.userID;
    const id = req.body.id;
    const key = req.body.key;
    if(userID && id && key){
        verifyKey(userID, key).then(newKey => {
            finishCourse(id, userID).then(data => {
                res.status(200).send({data: data.data, status: true})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {
            console.log(error)
            if(error == 1){
                res.status(400).send({message: "bad key", error, status: false})
            }else{
                res.status(400).send({error, status: false})
            }
        })
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})




module.exports = router;