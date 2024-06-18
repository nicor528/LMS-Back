const express = require('express');
const { getQuizz, getQuiz1, saveScore, vinculateQuizzWithUser, createTries, getTries, getUser2, getAllUserCourses, finishLesson, getOneCourse, vinculateCertificate, vinculateModule } = require('../apis/apiStrapi');
const { createNewScore } = require('../apis/apiFirebase');
const router = express.Router();


router.post("/get-quizz", async (req, res) => {
    const { user_ID, quiz_ID } = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!quiz_ID || !user_ID || !token) {
        return res.status(401).send({ message: "Missing data in the body", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        const quizz = await getQuiz1(parseInt(quiz_ID));
        let quizz1 = quizz.data;
        let n = 0;
        quizz.data.attributes.lms_questions.data.map(question => {
            let newquestion = {};
            newquestion.attributes = {};
            newquestion.attributes.question = question.attributes.question;
            newquestion.attributes.options = [question.attributes.wrong_answer_1, question.attributes.wrong_answer_2, question.attributes.wrong_answer_3, question.attributes.correct_answer_1];
            quizz1.attributes.lms_questions.data[n] = newquestion;
            quizz1.attributes.max_tries = quizz.data.attributes.max_tries;
            n++;
        });
        res.status(200).send({ data: quizz1, status: true });
    } catch (error) {
        console.log(refreshToken)
        console.log(error.name)
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                const quizz = await getQuiz1(parseInt(quiz_ID));
                let quizz1 = quizz.data;
                let n = 0;
                quizz.data.attributes.lms_questions.data.map(question => {
                    let newquestion = {};
                    newquestion.attributes = {};
                    newquestion.attributes.question = question.attributes.question;
                    newquestion.attributes.options = [question.attributes.wrong_answer_1, question.attributes.wrong_answer_2, question.attributes.wrong_answer_3, question.attributes.correct_answer_1];
                    quizz1.attributes.lms_questions.data[n] = newquestion;
                    quizz1.attributes.max_tries = quizz.data.attributes.max_tries;
                    n++;
                });
                res.status(200).send({ data: quizz1,   newAccessToken: newAccessToken, status: true });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } else {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }
    }
});


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

router.post("/get-quizz-module-result", async (req, res) => {
    const { answers, quiz_ID, user_ID } = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!answers || !quiz_ID || !user_ID || !token) {
        return res.status(400).send({ message: "Missing data in the body", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        const user = await getUser2(user_ID);
        const quizz = await getQuiz1(quiz_ID);
        const right_answers = quizz.data.attributes.lms_questions.data.map(question => {
            return { correct_answer: question.attributes.correct_answer_1, question: question.attributes.question };
        });

        const questions_N = quizz.data.attributes.lms_questions.data.length;
        let correct_answers = 0;
        answers.map(answer => {
            const correct = right_answers.find(data => data.question === answer.question && data.correct_answer === answer.answer);
            if (correct) {
                correct_answers++;
            }
        });

        const total_score = (correct_answers * 100) / questions_N;
        const pass = total_score >= 50;

        await createNewScore(user_ID, quizz.data.attributes.lms_module.data.id, total_score, pass);

        if (pass) {
            await vinculateModule(user.id, quizz.data.attributes.lms_module.data.id);
        }

        res.status(200).send({ data: { score: total_score, aproved: pass }, status: true });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                const user = await getUser2(user_ID);
                const quizz = await getQuiz1(quiz_ID);
                const right_answers = quizz.data.attributes.lms_questions.data.map(question => {
                    return { correct_answer: question.attributes.correct_answer_1, question: question.attributes.question };
                });

                const questions_N = quizz.data.attributes.lms_questions.data.length;
                let correct_answers = 0;
                answers.map(answer => {
                    const correct = right_answers.find(data => data.question === answer.question && data.correct_answer === answer.answer);
                    if (correct) {
                        correct_answers++;
                    }
                });

                const total_score = (correct_answers * 100) / questions_N;
                const pass = total_score >= 50;

                await createNewScore(user_ID, quizz.data.attributes.lms_module.data.id, total_score, pass);

                if (pass) {
                    await vinculateModule(user.id, quizz.data.attributes.lms_module.data.id);
                }

                res.status(200).send({ data: { score: total_score, aproved: pass },  newAccessToken: newAccessToken, status: true });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } else {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }
    }
});


router.post("/get-quizz-result", async (req, res) => {
    const { answers, quiz_ID, user_ID } = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!answers || !quiz_ID || !user_ID || !token) {
        return res.status(400).send({ message: "Missing data in the body", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        const user = await getUser2(user_ID);
        const quizz = await getQuiz1(quiz_ID);
        const right_answers = quizz.data.attributes.lms_questions.data.map(question => {
            return { correct_answer: question.attributes.correct_answer_1, question: question.attributes.question };
        });

        const questions_N = quizz.data.attributes.lms_questions.data.length;
        let correct_answers = 0;
        answers.map(answer => {
            const correct = right_answers.find(data => data.question === answer.question && data.correct_answer === answer.answer);
            if (correct) {
                correct_answers++;
            }
        });

        const total_score = (correct_answers * 100) / questions_N;
        const pass = total_score >= 50;

        await saveScore(user.id, quiz_ID, total_score);
        await vinculateQuizzWithUser(user_ID, quiz_ID);

        if (pass) {
            const data = await getAllUserCourses();
            const allCourses = data.data.filter(course => course.attributes.user_ID === user_ID && (course.attributes.lms_course.data.id === quizz.data.attributes.lms_course.data.id || course.id === quizz.data.attributes.lms_course.data.id));

            if (allCourses.length > 0) {
                await finishLesson(allCourses[0].id, "finish", total_score);

                const course = await getOneCourse(quizz.data.attributes.lms_course.data.id);
                await vinculateCertificate(user.id, course.data.attributes.lms_certificate.data.id);
            }
        }

        res.status(200).send({ data: { score: total_score, aproved: pass }, status: true });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                const user = await getUser2(user_ID);
                const quizz = await getQuiz1(quiz_ID);
                const right_answers = quizz.data.attributes.lms_questions.data.map(question => {
                    return { correct_answer: question.attributes.correct_answer_1, question: question.attributes.question };
                });

                const questions_N = quizz.data.attributes.lms_questions.data.length;
                let correct_answers = 0;
                answers.map(answer => {
                    const correct = right_answers.find(data => data.question === answer.question && data.correct_answer === answer.answer);
                    if (correct) {
                        correct_answers++;
                    }
                });

                const total_score = (correct_answers * 100) / questions_N;
                const pass = total_score >= 50;

                await saveScore(user.id, quiz_ID, total_score);
                await vinculateQuizzWithUser(user_ID, quiz_ID);

                if (pass) {
                    const data = await getAllUserCourses();
                    const allCourses = data.data.filter(course => course.attributes.user_ID === user_ID && (course.attributes.lms_course.data.id === quizz.data.attributes.lms_course.data.id || course.id === quizz.data.attributes.lms_course.data.id));

                    if (allCourses.length > 0) {
                        await finishLesson(allCourses[0].id, "finish", total_score);

                        const course = await getOneCourse(quizz.data.attributes.lms_course.data.id);
                        await vinculateCertificate(user.id, course.data.attributes.lms_certificate.data.id);
                    }
                }

                res.status(200).send({ data: { score: total_score, aproved: pass },  newAccessToken: newAccessToken, status: true });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } else {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }
    }
});



module.exports = router;