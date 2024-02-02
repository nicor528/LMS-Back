const express = require('express');
const { getQuizz, getQuiz1 } = require('../apis/apiStrapi');
const router = express.Router();


router.post("/get-quizz", async (req, res) => {
    const quiz_ID = req.body.quiz_ID;
    if(quiz_ID){
        getQuiz1(quiz_ID).then(quizz => {
            res.status(200).send({data: quizz.data, status: true})
        })
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/get-quizz-result")


module.exports = router;