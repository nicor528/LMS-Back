const express = require('express');
const { createCharge } = require('../apis/apiStripe');
const router = express.Router();

router.post("/payOneMonth", async (req, res) => {
    createCharge().then(charge => {
        
    })
})

router.post("/subscribe", async (req, res) => {
    
})








module.exports = router;