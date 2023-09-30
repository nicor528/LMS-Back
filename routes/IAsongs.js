/**
 * @swagger
 * tags:
 *   name: IAsongs
 *   description: IAsongs operations
 */

const express = require('express');
const { addIAsong } = require('../apis/apiDynamoDB');
const router = express.Router();

/**
 * @swagger
 * /api/IAsongs/addIAsong:
 *   post:
 *     summary: Add an IA song associated with a user
 *     tags: [IAsongs]
 *     requestBody:
 *       description: Song details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               id:
 *                 type: string
 *               albumCover:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: IA song added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: ok
 *               status: true
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request
 */
router.post("/addIAsong", async (req, res) => {
    const title = req.body.title;
    const id = req.body.id;
    const albumCover = req.body.albumCover;
    const link = req.body.link;
    if(title && id && albumCover && link){
        addIAsong(id, title, albumCover, link).then(result => {
            res.status(200).send({message: "ok", status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/getIAsongsFromUser", async (req, res) => {
    
})




module.exports = router;