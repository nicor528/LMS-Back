const express = require("express");
const qs = require("qs");
const {
    usersNotificationfetch,
} = require("../apis/notifications/apiNotificationService");
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