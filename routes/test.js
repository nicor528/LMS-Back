const express = require('express');
const { isTest,
    getTestInfo,
    updateTestInfo,
    checkAnswerCounter,
    checkTestTime } = require('../apis/apiStrapi');
const router = express.Router();