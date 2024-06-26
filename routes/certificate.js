const express = require('express');
const { getCertificate, getUser2 } = require('../apis/apiStrapi');
const { verifyToken, refreshAccessToken } = require('../apis/apiFirebase');
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

router.get("/user-certificates", async (req, res) => {
    const { user_ID } = req.query;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !token) {
        return res.status(400).send({ message: "Missing data", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);

        const user = await getUser2(user_ID);
        const certificatePromises = user.attributes.lms_certificates.data.map(certificate => getCertificate(certificate.id));
        const certificates = await Promise.all(certificatePromises);

        res.status(200).send({ data: certificates, status: true });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                res.setHeader('new-access-token', newAccessToken);

                const user = await getUser2(user_ID);
                const certificatePromises = user.attributes.lms_certificates.data.map(certificate => getCertificate(certificate.id));
                const certificates = await Promise.all(certificatePromises);

                res.status(200).send({ data: certificates, newAccessToken: newAccessToken, status: true });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } if (error.name === 'TokenExpiredError') {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }else {
            res.status(400).send({ message: error.name, status: false });
        }
    }
});


module.exports = router;