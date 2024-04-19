const express = require('express');
const { getOpenRequests } = require('../apis/apiFirebase');
const router = express.Router();

router.get("/open-user-courses-requests", (req, res) => {
    getOpenRequests().then(data => {
        res.status(200).send({data: data, status: true})
    }).catch(error => {res.status(400).send({error, status: false})})
})


module.exports = router;