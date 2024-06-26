const express = require("express");
const qs = require("qs");
const {
    usersNotificationfetch,
} = require("../apis/notifications/apiNotificationService");
const { getAllUserCourses, getAnnoucnment } = require("../apis/apiStrapi");
const { verifyToken, refreshAccessToken } = require('../apis/apiFirebase');
const router = express.Router();

router.post("/notify-strapi", (req, res) => {
    const notification = req.body;
    console.log("Received notification:", notification);
    // Process the notification (e.g., send it to the frontend)
    res.status(200).send("Notification received");
});

router.get("/get-singleUser-notification/:userId", function (req, res) {
    const userId = req.params.userId;

    const query = qs.stringify({
        populate: ["lms_notification_services.addNotification"],
    });

    usersNotificationfetch(query)
        .then(async (response) => {
            const result = await response;
            const userFound = await result.filter(
                (user) => user.attributes.user_ID === userId
            );
            if (userFound.length > 0) {
                res.send(userFound);
            } else {
                res.send({message: "User not found !"});
            }
        })
        .catch((err) => res.send({message: err.message}));
});

router.get("/get-user-notifications", (req, res) => {
    const user_ID = req.query.user_ID;
    if(user_ID){
        getAllUserCourses().then(async (data) => {
            const allCourses = await data.data.filter(data => data.attributes.user_ID === user_ID && data.attributes.finish === false)
            const courses = await getCourses();
            let course = courses.data.filter(item => item.id === allCourses[0].attributes.lms_course.data.id);
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

router.get("/user-notifications", async (req, res) => {
    const { user_ID } = req.query;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !token) {
        return res.status(401).send({ message: "Missing data", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        const data = await getAllUserCourses();
        const allCourses = data.data.filter(course => course.attributes.user_ID === user_ID && !course.attributes.finish);

        if (allCourses.length === 0) {
            return res.status(200).send({ data: [], status: true, message: "Successful" });
        }

        const annoucments = allCourses.map(course => {
            return {
                courseID: course.attributes.lms_course.data.id,
                announcements: course.attributes.lms_course.data.attributes.announcements
            };
        });

        const notis = annoucments.map(async data => {
            const toReturn = await Promise.all(data.announcements.data.map(async item => {
                const announcementData = await getAnnoucnment(item.id);
                const users = announcementData.data.attributes.lms_users.data;

                if (!users.length || !users.some(user => user.attributes.user_ID === user_ID)) {
                    return {
                        date: announcementData.data.attributes.createdAt,
                        type: "announcement",
                        announcement_ID: announcementData.data.id,
                        title: announcementData.data.attributes.title,
                        courseID: announcementData.data.attributes.lms_course.data.id,
                        description: "Your course has a new announcement"
                    };
                }
            }));
            return toReturn.filter(Boolean);
        });

        const result = await Promise.all(notis);
        res.status(200).send({ data: result.flat(), status: true, message: "Successful" });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                const data = await getAllUserCourses();
                const allCourses = data.data.filter(course => course.attributes.user_ID === user_ID && !course.attributes.finish);

                if (allCourses.length === 0) {
                    return res.status(200).send({ data: [], status: true, message: "Successful" });
                }

                const annoucments = allCourses.map(course => {
                    return {
                        courseID: course.attributes.lms_course.data.id,
                        announcements: course.attributes.lms_course.data.attributes.announcements
                    };
                });

                const notis = annoucments.map(async data => {
                    const toReturn = await Promise.all(data.announcements.data.map(async item => {
                        const announcementData = await getAnnoucnment(item.id);
                        const users = announcementData.data.attributes.lms_users.data;

                        if (!users.length || !users.some(user => user.attributes.user_ID === user_ID)) {
                            return {
                                date: announcementData.data.attributes.createdAt,
                                type: "announcement",
                                announcement_ID: announcementData.data.id,
                                title: announcementData.data.attributes.title,
                                courseID: announcementData.data.attributes.lms_course.data.id,
                                description: "Your course has a new announcement"
                            };
                        }
                    }));
                    return toReturn.filter(Boolean);
                });

                const result = await Promise.all(notis);
                res.status(200).send({ data: result.flat(), newAccessToken: newAccessToken, status: true, message: "Successful" });
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


// router.get("/get-notifications", function (req, res) {
//     // console.log(req)

//     const query = qs.stringify({
//         populate: [
//           'lms_notification_services.addNotification',
//           'lms_user_courses',
//           'lms_user_type'
//         ]
//       })

//     usersNotificationfetch(query)
//         .then(async (response) => {
//             const result = await response;

//             console.log(result, "res found in route page");
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err, "err in route page");
//             res.send("Notification not found");
//         });
// });

module.exports = router;