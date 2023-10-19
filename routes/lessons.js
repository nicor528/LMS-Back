const express = require('express');
const { getCourseLessons } = require('../apis/apiStrapi');
const router = express.Router();

router.post("/getCourseLessons", async (req,res) => {
    const courseID = req.body.courseID;
    if(courseID){
        getCourseLessons(courseID).then(async (lessons) => {
            res.status(200).send({data: lessons, status: true})
        })
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

module.exports = router;