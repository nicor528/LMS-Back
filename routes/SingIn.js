/**
 * @swagger
 * tags:
 *   name: SingIn
 *   description: SingIn operations
 */

const express = require('express');
const { createUser, createID, getUser, getID, getKey } = require('../apis/apiDynamoDB');
const { SingInPass, resetPass } = require('../apis/apiAuth');
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
            getID(user.uid).then(id => {
                getKey(id).then(key => {
                    getUser(id).then(async (user) => {
                        const data = await {
                            user,
                            key
                        }
                        res.status(200).send({data, status: true, message: "succefull singIn"})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({message: "Wrong email or password", status: false})})
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
        getID(uid).then(id => {
            getKey(id).then(key => {
                getUser(id).then(async (user) => {
                    const data = await {
                        user,
                        key
                    }
                    res.status(200).send({data, status:true, message: "succesfull singIn"})
                }).catch(error => {res.status(400).send({error, status:false})})
            }).catch(error => {res.status(400).send({error, status:false})})
        }).catch(error => {
            if(error == 1){
                res.status(400).send({message: "No User find", status: false})
            }else{
                res.status(400).send({error, status: false})
            }
        })
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


module.exports = router;