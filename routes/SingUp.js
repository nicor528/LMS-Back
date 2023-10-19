/**
 * @swagger
 * tags:
 *   name: SingUp
 *   description: SingUp operations
 */
const express = require('express');
const { createUser, createID, setNewKey, generateAlphanumericCode, setPat, getID } = require('../apis/apiDynamoDB');
const router = express.Router();
const { SingUpEmail1 } = require('../apis/apiAuth');

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
    const User = req.body.user;
    const email = req.body.email;
    if(uid && User && email){
        getID(uid).then(() => {
            res.status(401).send({message: "User already exist", status: false})
        }).catch(error => {
            if(error == 1){
                createID(uid).then(id => {
                    createUser(id, User, email, "").then(async (user) => {
                        const key = await generateAlphanumericCode();
                        setNewKey(id, key).then(async  () => {
                                    const data = await {
                                        id: id,
                                        key: key,
                                    }
                                    res.status(200).send({data, status: true, message: "registration succefull"})
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }).catch(error => {
                        console.log(error)
                        res.status(400).send({error, status:false})
                    })
                }).catch(error => {res.status(400).send({error, status:false})})
            }else{
                res.status(401).send({error, status:false})
            }
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
    console.log(req.body)
    const User = req.body.user;
    //const uid = req.body.uid;
    const email = req.body.email;
    const pass = req.body.pass;
    if(User && email && pass){
        SingUpEmail1(email, pass).then(user1 => {
            createID(user1.uid).then(id => {
                createUser(id, User, email, pass).then(async (user) => {
                    const key = await generateAlphanumericCode();
                    setNewKey(id, key).then(async () => {
                                const data = await {
                                    id: id,
                                    key: key,
                                }
                                res.status(200).send({data, status: true, message: "Success"})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {
                    console.log(error)
                })
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(async (error) => {
            if(error == 1){
                res.status(401).send({message: "email already in use", status: false})
            }if(error == 2){
                res.status(401).send({message: "To short password", status: false})
            }else{
                res.status(400).send(error)
            }
        })
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/singUpFace")

router.post("/singUpTwitter")


module.exports = router;