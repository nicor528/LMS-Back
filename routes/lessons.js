const express = require('express');
const { getCourseLessons, getCourses, vinculateLesson, vinculateModule, getModule, getLesson, getOneUserCourse, updatePercentage, getUser2, getAllUserCourses, addPoints, unVinculateLesson, getTextLesson } = require('../apis/apiStrapi');
const { getPDF, getScore, refreshAccessToken, verifyToken } = require('../apis/apiFirebase');
const router = express.Router();

/*
router.get("/getCourseLessons", async (req,res) => {
    const lesson_ID = parseInt(req.query.lesson_ID);
    if(lesson_ID){
        /*
        getCourseLessons(courseID).then(async (lessons) => {
            res.status(200).send({data: lessons, status: true})
        })*/
        /*getCourses().then(async (data) => {
            const course = await data.data.filter(item => item.attributes.courseID === course_ID)
            //console.log(course[0])
            res.status(200).send({data: course[0].attributes.lms_lessons.data, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})*/

router.get("/get-module", async (req, res) => {
    const { module_ID, user_ID } = req.query;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!module_ID || !user_ID || !token) {
        return res.status(401).send({ message: "Missing data", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        // Si el token es válido, continuar con la lógica normal
        const module = await getModule(parseInt(module_ID));
        let module1 = module;
        const finish = module1.data.attributes.lms_users.data.find(user => user.attributes.user_ID == user_ID);

        if (finish !== undefined) {
            module1.data.attributes.finish = true;
            module1.data.attributes.lms_users = [];
            const score = await getScore(user_ID, parseInt(module_ID));
            module1.data.attributes.score = score;
            res.status(200).send({ data: module1.data, status: true });
        } else {
            module1.data.attributes.finish = false;
            module1.data.attributes.lms_users = [];
            res.status(200).send({ data: module1.data, status: true });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                res.setHeader('new-access-token', newAccessToken);
                const module = await getModule(parseInt(module_ID));
                let module1 = module;
                const finish = module1.data.attributes.lms_users.data.find(user => user.attributes.user_ID == user_ID);

                if (finish !== undefined) {
                    module1.data.attributes.finish = true;
                    module1.data.attributes.lms_users = [];
                    const score = await getScore(user_ID, parseInt(module_ID));
                    module1.data.attributes.score = score;
                    res.status(200).send({ data: module1.data, status: true });
                } else {
                    module1.data.attributes.finish = false;
                    module1.data.attributes.lms_users = [];
                    res.status(200).send({ data: module1.data, newAccessToken: newAccessToken, status: true });
                }
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } if (error.name === 'TokenExpiredError') {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }else {
            res.status(400).send({ message: error.name, status: false });
        }
    }
});


router.post("/finish-module", async (req, res) => {
    const { user_ID, module_ID } = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !module_ID || !token) {
        return res.status(400).send({ message: "Missing data", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        const user = await getUser2(user_ID);
        await vinculateModule(user.id, parseInt(module_ID));
        const module = await getModule(parseInt(module_ID));
        let module1 = module;
        module1.data.attributes.finish = true;
        module1.data.attributes.lms_users = [];
        res.status(200).send({ data: module1.data, status: true });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                const user = await getUser2(user_ID);
                await vinculateModule(user.id, parseInt(module_ID));
                const module = await getModule(parseInt(module_ID));
                let module1 = module;
                module1.data.attributes.finish = true;
                module1.data.attributes.lms_users = [];
                res.status(200).send({ data: module1.data, newAccessToken: newAccessToken, status: true });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } if (error.name === 'TokenExpiredError') {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }else {
            res.status(400).send({ message: error.name, status: false });
        }
    }
});


router.post("/un-finish-lesson", async (req, res) => {
    const { user_ID, lesson_ID, course_ID } = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !lesson_ID || !token) {
        return res.status(400).send({ message: "Missing data", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        const user = await getUser2(user_ID);
        const lesson = await getLesson(lesson_ID);
        let lesson1 = lesson;
        const finish = lesson1.data.attributes.lms_users.data.find(user => user.attributes.user_ID == user_ID);

        if (finish !== undefined) {
            await unVinculateLesson(user.id, lesson_ID);
            const allCourses = (await getAllUserCourses()).data.filter(data => data.attributes.user_ID === user_ID && (data.attributes.lms_course.data.id === course_ID || data.id === course_ID));
            const course = allCourses[0];
            let completed_porcent = 100 / course.attributes.total_lessons;
            completed_porcent = course.attributes.percentage - completed_porcent;
            await updatePercentage(completed_porcent, course.id);

            const updatedLesson = await getLesson(lesson_ID);
            let lesson1 = updatedLesson;
            lesson1.data.attributes.finish = false;
            lesson1.data.attributes.lms_users = [];
            res.status(200).send({ data: lesson1.data, status: true });
        } else {
            lesson1.data.attributes.finish = false;
            lesson1.data.attributes.lms_users = [];
            res.status(200).send({ data: lesson1.data, status: true });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                const user = await getUser2(user_ID);
                const lesson = await getLesson(lesson_ID);
                let lesson1 = lesson;
                const finish = lesson1.data.attributes.lms_users.data.find(user => user.attributes.user_ID == user_ID);

                if (finish !== undefined) {
                    await unVinculateLesson(user.id, lesson_ID);
                    const allCourses = (await getAllUserCourses()).data.filter(data => data.attributes.user_ID === user_ID && (data.attributes.lms_course.data.id === course_ID || data.id === course_ID));
                    const course = allCourses[0];
                    let completed_porcent = 100 / course.attributes.total_lessons;
                    completed_porcent = course.attributes.percentage - completed_porcent;
                    await updatePercentage(completed_porcent, course.id);

                    const updatedLesson = await getLesson(lesson_ID);
                    let lesson1 = updatedLesson;
                    lesson1.data.attributes.finish = false;
                    lesson1.data.attributes.lms_users = [];
                    res.status(200).send({ data: lesson1.data, newAccessToken: newAccessToken, status: true });
                } else {
                    lesson1.data.attributes.finish = false;
                    lesson1.data.attributes.lms_users = [];
                    res.status(200).send({ data: lesson1.data, newAccessToken: newAccessToken, status: true });
                }
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } if (error.name === 'TokenExpiredError') {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }else {
            res.status(400).send({ message: error.name, status: false });
        }
    }
});


router.get("/get-lesson", async (req, res) => {
    const { lesson_ID, user_ID } = req.query;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!lesson_ID || !user_ID || !token) {
        return res.status(400).send({ message: "Missing data", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        const lesson = await getLesson(parseInt(lesson_ID));
        let lesson1 = lesson;
        const finish = lesson1.data.attributes.lms_users.data.find(user => user.attributes.user_ID == user_ID);

        if (lesson1.data.attributes.type === "pdf") {
            const url = await getPDF(lesson1.data.attributes.description);
            lesson1.data.attributes.pdfUrl = url;
        } else if (lesson1.data.attributes.type === "text") {
            const textLesson = await getTextLesson(lesson1.data.attributes.title);
            lesson1.data.attributes.lesson = textLesson.data[0];
        }

        lesson1.data.attributes.finish = finish !== undefined;
        lesson1.data.attributes.lms_users = [];
        res.status(200).send({ data: lesson1.data, status: true });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                const lesson = await getLesson(parseInt(lesson_ID));
                let lesson1 = lesson;
                const finish = lesson1.data.attributes.lms_users.data.find(user => user.attributes.user_ID == user_ID);

                if (lesson1.data.attributes.type === "pdf") {
                    const url = await getPDF(lesson1.data.attributes.description);
                    lesson1.data.attributes.pdfUrl = url;
                } else if (lesson1.data.attributes.type === "text") {
                    const textLesson = await getTextLesson(lesson1.data.attributes.title);
                    lesson1.data.attributes.lesson = textLesson.data[0];
                }

                lesson1.data.attributes.finish = finish !== undefined;
                lesson1.data.attributes.lms_users = [];
                res.status(200).send({ data: lesson1.data, newAccessToken: newAccessToken, status: true });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } if (error.name === 'TokenExpiredError') {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }else {
            res.status(400).send({ message: error.name, status: false });
        }
    }
});


router.post("/finish-lesson", async (req, res) => {
    const { course_ID, user_ID, lesson_ID } = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !lesson_ID || !course_ID || !token) {
        return res.status(400).send({ message: "Missing data", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        const user = await getUser2(user_ID);
        const lesson = await getLesson(lesson_ID);
        let lesson1 = lesson;
        const finish = lesson1.data.attributes.lms_users.data.find(user => user.attributes.user_ID == user_ID);

        if (finish !== undefined) {
            lesson1.data.attributes.finish = true;
            lesson1.data.attributes.lms_users = [];
            if (lesson1.data.attributes.type === "pdf") {
                const url = await getPDF(lesson1.data.attributes.description);
                lesson1.data.attributes.pdfUrl = url;
            }
            res.status(200).send({ data: lesson1.data, status: true });
        } else {
            await vinculateLesson(user.id, lesson_ID);
            const allCourses = (await getAllUserCourses()).data.filter(data => data.attributes.user_ID === user_ID && (data.attributes.lms_course.data.id === course_ID || data.id === course_ID));
            const course = allCourses[0];
            let completed_porcent = 100 / course.attributes.total_lessons;
            completed_porcent = completed_porcent + course.attributes.percentage;
            await updatePercentage(completed_porcent, course.id);

            const updatedLesson = await getLesson(lesson_ID);
            const newPoints = parseInt(user.attributes.points) + 10;
            await addPoints(user.id, newPoints);
            let lesson1 = updatedLesson;
            lesson1.data.attributes.finish = true;
            lesson1.data.attributes.lms_users = [];

            if (lesson1.data.attributes.type === "pdf") {
                const url = await getPDF(lesson1.data.attributes.description);
                lesson1.data.attributes.pdfUrl = url;
            }
            res.status(200).send({ data: lesson1.data, status: true });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                const user = await getUser2(user_ID);
                const lesson = await getLesson(lesson_ID);
                let lesson1 = lesson;
                const finish = lesson1.data.attributes.lms_users.data.find(user => user.attributes.user_ID == user_ID);

                if (finish !== undefined) {
                    lesson1.data.attributes.finish = true;
                    lesson1.data.attributes.lms_users = [];
                    if (lesson1.data.attributes.type === "pdf") {
                        const url = await getPDF(lesson1.data.attributes.description);
                        lesson1.data.attributes.pdfUrl = url;
                    }
                    res.status(200).send({ data: lesson1.data, status: true });
                } else {
                    await vinculateLesson(user.id, lesson_ID);
                    const allCourses = (await getAllUserCourses()).data.filter(data => data.attributes.user_ID === user_ID && (data.attributes.lms_course.data.id === course_ID || data.id === course_ID));
                    const course = allCourses[0];
                    let completed_porcent = 100 / course.attributes.total_lessons;
                    completed_porcent = completed_porcent + course.attributes.percentage;
                    await updatePercentage(completed_porcent, course.id);

                    const updatedLesson = await getLesson(lesson_ID);
                    const newPoints = parseInt(user.attributes.points) + 10;
                    await addPoints(user.id, newPoints);
                    let lesson1 = updatedLesson;
                    lesson1.data.attributes.finish = true;
                    lesson1.data.attributes.lms_users = [];

                    if (lesson1.data.attributes.type === "pdf") {
                        const url = await getPDF(lesson1.data.attributes.description);
                        lesson1.data.attributes.pdfUrl = url;
                    }
                    res.status(200).send({ data: lesson1.data, newAccessToken: newAccessToken, status: true });
                }
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } if (error.name === 'TokenExpiredError') {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }else {
            res.status(400).send({ message: error.name, status: false });
        }
    }
});


/*
router.post("/finish-lesson", (req, res) => {
    const user_ID = req.body.user_ID;
    const lesson_ID = parseInt(req.body.lesson_ID);
    if(user_ID && lesson_ID){
        vinculateLesson(user_ID, lesson_ID).then(response => {
            res.status(200).send({data: response.data, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})*/

module.exports = router;