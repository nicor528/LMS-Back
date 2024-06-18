const express = require('express');
const { getOpenRequests, aproveUserCourseRequest, getCloseRequests, verifyToken, refreshAccessToken } = require('../apis/apiFirebase');
const { getAllUsers, getCourses, getOneCourse1, vinculateCourse } = require('../apis/apiStrapi');
const router = express.Router();

router.get("/get-open-user-courses-requests", async (req, res) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!token) {
        return res.status(400).send({ message: "Missing data", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        const openRequests = await getOpenRequests();
        res.status(200).send({ data: openRequests, status: true });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken("admin", refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                const openRequests = await getOpenRequests();
                res.status(200).send({ data: openRequests, newAccessToken, status: true });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } else {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }
    }
});

router.get("/get-closed-user-course-request", async (req, res) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!token) {
        return res.status(400).send({ message: "Missing data", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        const closedRequests = await getCloseRequests();
        res.status(200).send({ data: closedRequests, status: true });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken("admin", refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                const closedRequests = await getCloseRequests();
                res.status(200).send({ data: closedRequests, newAccessToken, status: true });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } else {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }
    }
});

router.post("/aprove-or-denied-user-course-request", async (req, res) => {
    const { user_ID, course_ID, aproved } = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !course_ID || (aproved == null) || !token) {
        return res.status(400).send({ message: "Missing data", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        await aproveUserCourseRequest(user_ID + course_ID, aproved);

        if (aproved) {
            const courses = await getCourses();
            const course = courses.data.find(item => item.id === parseInt(course_ID));
            const fullCourse = await getOneCourse1(course.id);
            let n_lessons = 0;

            fullCourse.data.attributes.lms_modules.data.forEach(module => {
                module.attributes.lms_lessons.data.forEach(() => {
                    n_lessons++;
                });
            });

            await vinculateCourse(user_ID, course_ID, course, n_lessons);
        }

        const openRequests = await getOpenRequests();
        res.status(200).send({ data: openRequests, status: true });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken("admin", refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                await aproveUserCourseRequest(user_ID + course_ID, aproved);

                if (aproved) {
                    const courses = await getCourses();
                    const course = courses.data.find(item => item.id === parseInt(course_ID));
                    const fullCourse = await getOneCourse1(course.id);
                    let n_lessons = 0;

                    fullCourse.data.attributes.lms_modules.data.forEach(module => {
                        module.attributes.lms_lessons.data.forEach(() => {
                            n_lessons++;
                        });
                    });

                    await vinculateCourse(user_ID, course_ID, course, n_lessons);
                }

                const openRequests = await getOpenRequests();
                res.status(200).send({ data: openRequests, newAccessToken, status: true });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } else {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }
    }
});

router.get("/get-all-users", async (req, res) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!token) {
        return res.status(400).send({ message: "Missing data", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        const users = await getAllUsers();
        res.status(200).send({ data: users.data, status: true });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken("admin", refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                const users = await getAllUsers();
                res.status(200).send({ data: users.data, newAccessToken: newAccessToken, status: true });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } else {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }
    }
});




module.exports = router;