const express = require('express');
const { getCertificate, getUser2 } = require('../apis/apiStrapi');
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

router.get("/user-certificates", (req, res) => {
    const user_ID = req.query.user_ID;
    if (user_ID) {
        getUser2(user_ID)
            .then(user => {
                const certificatePromises = user.attributes.lms_certificates.data.map((certificate) => {
                    return getCertificate(certificate.id);
                });

                Promise.all(certificatePromises)
                    .then(certificates => {
                        res.status(200).send({ data: certificates, status: true });
                    })
                    .catch(error => {
                        res.status(400).send({ error, status: false });
                    });
            })
            .catch(error => {
                res.status(400).send({ error, status: false });
            });
    } else {
        res.status(400).send({ message: "Missing data", status: false });
    }
});

module.exports = router;