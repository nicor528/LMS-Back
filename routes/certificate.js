const express = require('express');
const { getCertificate } = require('../apis/apiStrapi');
const router = express.Router();

router.get("/get-certificate", (req, res) => {
    const certificate_ID = req.query.certificate_ID;
    if(certificate_ID){
        getCertificate(certificate_ID).then(data => {
            res.status(200).send({data: data.data, status: true, message: "Success"})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})

module.exports = router;