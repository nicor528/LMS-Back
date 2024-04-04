const express = require('express');
const { getQuizz, getQuiz1, saveScore, vinculateQuizzWithUser, createTries, getTries } = require('../apis/apiStrapi');
const router = express.Router();


router.post("/get-quizz", async (req, res) => {
    const quiz_ID = req.body.quiz_ID;
    if(quiz_ID){
        getQuiz1(quiz_ID).then(quizz => {
            let quizz1 = quizz.data;
            let n = 0;
            quizz.data.attributes.lms_questions.data.map(question => {
                let newquestion = {}; 
                newquestion.attributes = {}
                newquestion.attributes.question = question.attributes.question;
                newquestion.attributes.options = [question.attributes.wrong_answer_1, question.attributes.wrong_answer_2, question.attributes.wrong_answer_3, question.attributes.correct_answer_1]
                quizz1.attributes.lms_questions.data[n] = newquestion;
                n ++;
            })
            res.status(200).send({data: quizz1, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.get("/quizz-attemps", (req, res) => {
    const quiz_ID = req.query.quiz_ID;
    const user_ID = req.query.user_ID;
    if(user_ID && quiz_ID){
        getTries().then(tries => {
            const filteredObjects = tries.data.filter(item => 
                item.attributes.lms_user.data.attributes.user_ID === user_ID &&
                item.attributes.lms_quiz.data.id === parseInt(quiz_ID)
            );
            const count = filteredObjects.length;
            res.status(200).send({data: {tries: count}, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data", status: false})
    }
})

router.post("/get-quizz-result", (req, res) => {
    const answers = req.body.answers;
    const quiz_ID = req.body.quizz_ID;
    const user_ID = req.body.user_ID;
    if(answers && quiz_ID && user_ID){
        getQuiz1(quiz_ID).then(quizz => {
            //const answers = [{question: "what is a variable?", answer: "i dont know"}, {question: "what is a function", answer: "asdsad"}]
            console.log(quizz.data.attributes.lms_questions.data[0])
            const right_answers = quizz.data.attributes.lms_questions.data.map(question => {
                return {correct_answer: question.attributes.correct_answer_1, question: question.attributes.question}
            })
            const questions_N = quizz.data.attributes.lms_questions.data.length
            let correct_answers = 0;
            answers.map(answer => {
                const correct = right_answers.find(data => data.question === answer.question && data.correct_answer === answer.answer)
                if(correct){
                    correct_answers ++
                }
            })
            const total_score = (correct_answers * 100)/questions_N
            console.log(total_score)
            const pass = total_score > 50 ? true : false
            saveScore(user_ID, quiz_ID, total_score).then((score) => { // to do
                vinculateQuizzWithUser(user_ID, quiz_ID).then(result => { //to do
                    createTries(user_ID, quiz_ID).then(result => {
                        res.status(200).send({data: {score: total_score, aproved: pass}, status: true})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data in the body", status: false})
    }
})


module.exports = router;