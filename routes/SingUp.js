/**
 * @swagger
 * tags:
 *   name: SingUp
 *   description: SingUp operations
 */
const express = require('express');
const router = express.Router();
const { SingUpEmail1 } = require('../apis/apiAuth');
const { createUser2, getUser2 } = require('../apis/apiStrapi');

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
    const name = req.body.name;
    const lastName = req.body.lastName;
    const email = req.body.email; 
    const birth = req.body.birth;
    const postal_code  = req.body.postal_code;
    const city = req.body.country;
    const province = req.body.province;
    const phone = req.body.phone;
    const street_name = req.body.street_name;
    if(uid && lastName && email && name && birth && postal_code && city && province && phone && street_name){
        createUser2(name, email, uid, lastName, birth, postal_code, city, province, phone, street_name).then(async (user) => {
            /*const data = await {
                ...user.data
            }*/
            getUser2(uid).then(user => {
                res.status(200).send({data: user.data, status: true, message: "registration succefull"})
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
    const name = req.body.name;
    //const uid = req.body.uid;
    const email = req.body.email;
    const lastName = req.body.lastName;
    const pass = req.body.pass;
    // const birth = req.body.birth;
    // const postal_code  = req.body.postal_code;
    // const city = req.body.country;
    // const province = req.body.province;
    // const phone = req.body.phone;
    // const street_name = req.body.street_name;
    if(name && email && pass && lastName ){
        SingUpEmail1(email, pass).then(user1 => {
            createUser2(name, email, user1.uid, lastName).then(async (user) => {
                /*const data = await {
                    ...user.data
                }*/
                getUser2(user1.uid).then(user => {
                    res.status(200).send({data: user.data, status: true, message: "Success"})
                }).catch(error => {
                    res.status(400).send({error, status: false})
                })
            }).catch(error => {
                res.status(400).send({error, status: false})
            })
        }).catch(async (error) => {
            if(error == 1){
                res.status(401).send({message: "email already in use", status: false})
            }if(error == 2){
                res.status(401).send({message: "To short password", status: false})
            }else{
                res.status(400).send({error, status: false})
            }
        })
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})



router.post("/singUpFace")

router.post("/singUpTwitter")


module.exports = router;