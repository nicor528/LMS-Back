/**
 * @swagger
 * tags:
 *   name: SingIn
 *   description: SingIn operations
 */

const express = require('express');
const { SingInPass, resetPass } = require('../apis/apiAuth');
const { getUser2, getAllUserCourses, editInfoUser } = require('../apis/apiStrapi');
const router = express.Router();

/**
 * @swagger
 * /api/singin/singInEmail:
 *   post:
 *     summary: Sing In using email and password
 *     tags: [SingIn]
 *     requestBody:
 *       description: User data for Email Sign In
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sign In successful
 *         content:
 *           application/json:
 *             example:
 *               user: { id: "123", name: "John",... }
 *               key: "abc123"
 *       400:
 *         description: Bad connection with DB
 *         content:
 *           application/json:
 *             example:
 *               error: Bad connection with DB
 */
router.post("/singInEmail", async (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
    if(email && pass){
        SingInPass(email, pass).then(user => {
            getUser2(user.uid).then(user => {
                getAllUserCourses().then(async (data) => {
                    console.log("test1")
                    console.log(user)
                    let user1 = await user;
                    const allCourses = await data.data.filter(data => data.attributes.user_ID === user.attributes.user_ID)
                    user1.attributes.lms_user_courses = allCourses.length > 0 ? allCourses : [];
                    console.log(user1)
                    res.status(200).send({data: user1, status: true, message: "loggin sucefully"})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({message: "Wrong email or password", status: false})})
        }).catch(error => {res.status(400).send({message: "Wrong email or password", status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.get("/getUserInfo", (req, res) => {
    const user_ID = req.query.user_ID;
    if(user_ID){
        getUser2(user_ID).then(user => {
            getAllUserCourses().then(async (data) => {
                console.log("test1")
                console.log(user)
                let user1 = await user;
                const allCourses = await data.data.filter(data => data.attributes.user_ID === user_ID)
                user1.attributes.lms_user_courses = allCourses.length > 0 ? allCourses : [];
                console.log(user1)
                res.status(200).send({data: user1, status: true})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

/**
 * @swagger
 * /api/singin/singInWithId:
 *   post:
 *     summary: Sing In using user ID
 *     tags: [SingIn]
 *     requestBody:
 *       description: User data for ID Sign In
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sign In successful
 *         content:
 *           application/json:
 *             example:
 *               user: { id: "123", name: "John" }
 *               key: "abc123"
 *       400:
 *         description: Bad connection with DB
 *         content:
 *           application/json:
 *             example:
 *               error: Bad connection with DB
 */
router.post("/singInWithId", async (req, res) => {
    const uid = req.body.uid;
    if(uid){
        getUser2(uid).then(user => {
            res.status(200).send({user, status: true, message: "login succefull"})
        }).catch(error => {res.status(400).send({message: "Wrong email or password", status: false})})
    }else{
        res.status(401).send({message: "missing uid", status: false})
    }
})

/**
 * @swagger
 * /api/singin/resetPass:
 *   post:
 *     summary: Reset your password.
 *     tags: [SingIn]
 *     requestBody:
 *       description: User email.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Video added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '400':
 *         description: Failed to get saved videos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '401':
 *         description: Missing data in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 */
router.post("/resetPass", async (req, res) => {
    const email = req.body.email;
    if(email){
        resetPass(email).then(() => {
            res.status(200).send({status:true, message: "ok"})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/edit-info-user", (req, res) => {
    const user_ID = req.body.user_ID;
    const name = req.body.name;
    const lastName = req.body.lastName;
    const birth = req.body.birth;
    const postal_code  = req.body.postal_code;
    const city = req.body.city;
    const province = req.body.province;
    const country = req.body.country;
    const street_name = req.body.street_name;
 //   const interests = req.body.interests;
    const academic = req.body.academic;
    if(country && user_ID && name && lastName && birth && postal_code && city && province && street_name && academic){
        editInfoUser(user_ID, name, lastName, birth, postal_code, city, province, street_name, academic, country).then(user => {
            
            res.status(200).send({data: user, status: true, message: "sucefull"})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})


module.exports = router;