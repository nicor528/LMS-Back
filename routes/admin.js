const express = require('express');
const { getOpenRequests } = require('../apis/apiFirebase');
const { getAllUsers } = require('../apis/apiStrapi');
const router = express.Router();

router.get("/get-open-user-courses-requests", (req, res) => {
    getOpenRequests().then(data => {
        res.status(200).send({data: data, status: true})
    }).catch(error => {res.status(400).send({error, status: false})})
})

router.post("/aprove-or-denied-user-course-request", (req, res) => {
    const request_ID = req.body.request_ID;
    const aproved = req.body.aproved;
    if(request_ID && (aproved == true || aproved == false)){
        
    }else{
        res.status(401).send({message: "Missing data", status: false})
    }
})

router.get("/get-all-users", (req, res) => {
    getAllUsers().then(users => {
        res.status(200).send({data: users.data, status: true})
    }).catch(error => {res.status(400).send({error, status: false})})
})


module.exports = router;