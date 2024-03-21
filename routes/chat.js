const express = require('express');
const { addMessage, getUser2, createConversation, getAllConversations, getConversation } = require('../apis/apiStrapi');
const router = express.Router();

router.post("/add-message", (req, res) => {
    const user_ID = req.body.from_user_ID;
    const user_ID2 = req.body.to_user_ID2;
    const message = req.body.message;
    const conversation_id = req.body.conversation_id;
    if(user_ID && user_ID2 && message && conversation_id){
        addMessage(user_ID, user_ID2, message, conversation_id).then(result => {
            res.status(200).send({data: result, status: true, message: "sucefull"})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "missing data in the body", status: false})
    }
})

router.post("/create-conversation", (req, res) => {
    const user_ID = req.body.user_ID;
    const user_ID2 = req.body.user_ID2;
    if(user_ID, user_ID2){
        getUser2(user_ID).then(user => {
            const id = user.id;
            getUser2(user_ID2).then(user => {
                const id2 = user.id
                createConversation(id, id2).then(result => {
                    res.status(200).send({data: result, status: true, message: "sucefull"})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "missing data in the body", status: false})  
    }
})

router.get("/get-user-conversations", (req, res) => {
    const user_ID = req.query.user_ID;
    if(user_ID){
        getUser2(user_ID).then(user => {
            getAllConversations(user.attributes.lms_conversations.data).then(conversations => {
                res.status(200).send({data: conversations, status: true, message: "sucefull"})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "missing data", status: false}) 
    }
})

router.get("/get-conversation-messages", (req, res) => {
    const conversation_id = req.query.conversation_id;
    if(conversation_id){
        getConversation(conversation_id).then(conver => {
            res.status(200).send({data: conver, status: true, message: "sucefull"})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "missing data", status: false}) 
    }
})

module.exports = router;