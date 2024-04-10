const express = require("express");
const qs = require("qs");
const {
    usersNotificationfetch,
} = require("../apis/notifications/apiNotificationService");
const { getAllUserCourses, getAnnoucnment } = require("../apis/apiStrapi");
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

router.get("/user-notifications", (req, res) => {
    const user_ID = req.query.user_ID;
    if(user_ID){
        getAllUserCourses().then(async (data) => {
            const allCourses = await data.data.filter(data => data.attributes.user_ID === user_ID && data.attributes.finish === false)
            console.log(allCourses[0].attributes.lms_course.data.attributes)
            const annoucments = allCourses.map(data => {
                let data1 = {};
                data1.courseID = data.attributes.lms_course.data.id;
                data1.announcements = data.attributes.lms_course.data.attributes.announcements;
                //data1.read = 
                return data1;
            })
            console.log(annoucments)
            const notis = annoucments.map(async data => {
                const toReturn = await Promise.all(data.announcements.data.map(async item => {
                    const announcementData = await getAnnoucnment(item.id);
                    const user = announcementData.data.attributes.lms_users.data.find(user => user.attributes.user_ID == user_ID);
                    if (user) {
                        return { title: announcementData.data.attributes.title, courseID: announcementData.data.attributes.lms_course.data.id };
                    }
                }));
                return toReturn.filter(Boolean); // Eliminar elementos undefined del array
            });
            
            Promise.all(notis).then(result => {
                console.log(result);
                res.status(200).send({data: result, status: true, message: "sucefull"})
            });
            
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data", status: false}) 
    }
})

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