/**
 * @swagger
 * tags:
 *   name: SingUp
 *   description: SingUp operations
 */
const express = require('express');
const router = express.Router();
const { SingUpEmail1 } = require('../apis/apiAuth');
const { createUser2, getUser2, getUser3 } = require('../apis/apiStrapi');
const { getProfilePicture, uploadProfilePicture } = require('../apis/apiFirebase');

const defaultPicture = "image/jpeg;base64,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"
    

/**
 * @swagger
 * /api/singup/test:
 *   get:
 *     summary: Test the SingUp route
 *     tags: [SingUp]
 *     responses:
 *       200:
 *         description: Test successful
 *         content:
 *           application/json:
 *             example:
 *               message: Test successful
 */
router.get("/test", (req,res) => {
    console.log("test")
    res.status(200).send("holaaaa")
})

/**
 * @swagger
 * /api/singup/singUpGoogle:
 *   post:
 *     summary: SingUp using Google
 *     tags: [SingUp]
 *     requestBody:
 *       description: User data for Google SignUp
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               user:
 *                 type: object
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: SignUp successful
 *         content:
 *           application/json:
 *             example:
 *               id: 12345
 *               key: abc123
 *       400:
 *         description: Bad connection with DB
 *         content:
 *           application/json:
 *             example:
 *               error: Bad connection with DB
 */
router.post("/singUpGoogle", async (req, res) => {
    const uid = req.body.uid;
    const email = req.body.email; 
    const name = "";
    const lastName = "";
    //const birth = req.body.birth;
    const postal_code  = "";
    const city = "";
    const province = "";
    const phone = "";
    const street_name = "";
    if(uid && email ){
        createUser2(name, email, uid, lastName, "2024-03-06T12:30:00Z", postal_code, city, province, phone, street_name).then(async (user) => {
            /*const data = await {
                ...user.data
            }*/
            getUser2(uid).then(user => {
                const image = Buffer.from(defaultPicture.split(",")[1], "base64");
                uploadProfilePicture(uid, image).then(url => {
                    user.data.attributes.profilePictureUrl = url;
                    res.status(200).send({ data: user.data, status: true, message: "Success" });
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {
                console.log(error)
                res.status(400).send({error, status:false})
            })
        }).catch(error => {
            console.log(error)
            res.status(400).send({error, status:false})
        })
    }else{
        res.status(401).send({message: "Missing data in the body", status:false})
    }
})

/**
 * @swagger
 * /api/singup/singUpEmail:
 *   post:
 *     summary: SingUp using email and password
 *     tags: [SingUp]
 *     requestBody:
 *       description: User data for Email SingUp
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *     responses:
 *       200:
 *         description: SingUp successful
 *         content:
 *           application/json:
 *             example:
 *               id: 12345
 *               key: abc123
 *       400:
 *         description: Bad connection with DB
 *         content:
 *           application/json:
 *             example:
 *               error: Bad connection with DB
 */
router.post("/singUpEmail", async (req, res) => {
    //console.log(req.body)
    const name = "";
    const lastName = "";
    //const uid = req.body.uid;
    const email = req.body.email;
    const pass = req.body.pass;
    //const birth = req.body.birth;
    const postal_code  = "";
    const city = "";
    const province = "";
    const phone = "";
    const street_name = "";
    if(email && pass){
        SingUpEmail1(email, pass).then(user1 => {
            console.log("test1")
            createUser2(name, email, user1.uid, lastName, "2024-03-06T12:30:00Z", postal_code, city, province, phone, street_name).then(async (user) => {
                /*const data = await {
                    ...user.data
                }*/
                console.log("test2")
                console.log(user)
                console.log("test3")
                const image = Buffer.from(defaultPicture.split(",")[1], "base64");
                getUser3(user.data.id)
                .then(user => {
                    uploadProfilePicture(user1.uid, image).then(url => {
                        user.data.attributes.profilePictureUrl = url;
                        res.status(200).send({ data: user.data, status: true, message: "Success" });
                    }).catch(error => {res.status(400).send({error, status: false})})
                })
                .catch(error => {
                    let errorMessage = "internal error in strapi app";
                    if (error.message) {
                        errorMessage += `: ${error.message}`;
                    }
                    res.status(400).send({ message: errorMessage, status: false });
                });
            }).catch(error => {
                res.status(400).send({error, status: false})
            })
        }).catch(async (error) => {
            if(error == 1){
                res.status(401).send({message: "email already in use", status: false})
            }if(error == 2){
                res.status(401).send({message: "To short password", status: false})
            }if(error != 1 && error != 2){
                res.status(400).send({message: error, status: false})
            }
        })
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/singUpFace")

router.post("/singUpTwitter")

module.exports = router;