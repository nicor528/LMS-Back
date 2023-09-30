/**
 * @swagger
 * tags:
 *   name: security
 *   description: security operations
 */
const express = require('express');
const { verifyKey, setNewKey } = require('../apis/apiDynamoDB');
const { generarEnlaceDeDescarga } = require('../apis/apiS3');
const router = express.Router();

router.post("/verifyRequest", async (req, res) => {
    // 401 = bad Api Key
    // 402 = no active subscription
    const id = req.body.id;
    const key = req.body.key;
    verifyKey(id, key).then(newKey => {
        setNewKey(id, key).then(async (data) => {
            res.status(200).send({key: newKey})
        }).catch(error => {res.status(400).send({error : "bad conection with DB"})})
    }).catch(error => {
        if(error == 1){
            res.status(401).send({error : "wrong key"})
        }else{
            res.status(400).send({error : "bad conection with DB"})
        }
    })
})

/**
 * @swagger
 * api/security/requestDownloadLink:
 *   post:
 *     summary: Solicitar un enlace de descarga
 *     tags: [security]
 *     requestBody:
 *       description: Objeto de solicitud para generar un enlace de descarga
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *     responses:
 *       200:
 *         description: Enlace de descarga generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       400:
 *         description: Error al generar el enlace de descarga o falta de datos en el cuerpo de la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       401:
 *         description: Datos faltantes en el cuerpo de la solicitud
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
router.post("/requestDownloadLink", async (req, res) => {
    const path = req.body.path;
    if(path){
        generarEnlaceDeDescarga(path).then(link => {
            res.status(200).send({data: link, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

router.post("/verifyDemo", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    verifyKey(id, key).then(newKey => {
        res.status(200).send({key: key})
    }).catch(error => {
        if(error == 1){
            res.status(401).send({error : "wrong key"})
        }else{
            res.status(400).send({error : "bad conection with DB"})
        }
    })
})




module.exports = router;