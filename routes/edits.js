const express = require('express');
const { createUser, createID, getUser, getID, verifyKey, editInfoUser, setNewKey } = require('../apis/apiDynamoDB');
const { SingInPass } = require('../apis/apiAuth');
const router = express.Router();

router.post("/editInfoUser", async (req, res) => {
    //const key = req.body.key;
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    //verifyKey(user.id, key).then(newKey => {
        //setNewKey(user.id, newKey).then(data => {
            editInfoUser(user).then(user => {
                res.status(200).send({})
            }).catch(error => {res.status(400).send({error : "bad conection with DB"})})
        //}).catch(error => {res.status(400).send({error : "bad conection with DB"})})
    //}).catch(error => {res.status(400).send({error : "bad conection with DB"})})
})


module.exports = router;