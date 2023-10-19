const express = require('express');
const { getQuizz } = require('../apis/apiStrapi');
const router = express.Router();


router.post("/getQuiz", async (req, res) => {
    const courseID = req.body.courseID;
    if(courseID){
        getQuizz(courseID).then(quizz => {
            res.status(200).send({data: quizz, status: true})
        })
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})


module.exports = router;