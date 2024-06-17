const express = require('express');
const { addMessage, getUser2, createConversation, getAllConversations, getConversation, readMessage, getConversation2, getAllUsers } = require('../apis/apiStrapi');
const router = express.Router();

router.post("/add-message", (req, res) => {
    const user_ID = req.body.from_user_ID;
    const user_ID2 = req.body.to_user_ID2;
    const message = req.body.message;
    const conversation_id = req.body.conversation_id;
    if(user_ID && user_ID2 && message && conversation_id){
        addMessage(user_ID, user_ID2, message, conversation_id).then(result => {
            getConversation2(conversation_id).then(conver => {
                res.status(200).send({data: conver, status: true, message: "sucefull"})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "missing data in the body", status: false})
    }
})

function filterUsersBySearchParam(users, searchParam) {
    // Expresión regular para buscar el parámetro de búsqueda como subcadena en minúsculas
    const searchRegex = searchParam.toLowerCase();
  
    // Filtrar usuarios basado en el criterio de búsqueda
    const filteredUsers = users.filter(user => {
      const name = user.attributes.name.toLowerCase();
      const lastName = user.attributes.last_name.toLowerCase();
      const email = user.attributes.email.toLowerCase();
  
      // Verificar si el parámetro de búsqueda está contenido en alguno de los campos
      return name.includes(searchRegex) || lastName.includes(searchRegex) || email.includes(searchRegex);
    });
  
    return filteredUsers;
  }

router.get("/search-user", (req, res) => {
    const search = req.query.search;
    if(search){
        getAllUsers().then(async (users) => {
            try{
                const newUsers = await filterUsersBySearchParam(users.data, search);
                res.status(200).send({data: newUsers, status: true, message: "sucefull"})
            }catch(error){
                res.status(400).send({error, status: false})
            }
        })
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

router.get("/get-one-user-conversations", (req, res) => {
    const user_ID = req.query.user_ID;
    const user_ID2 = req.query.user_ID2;
    if(user_ID && user_ID2){
        getUser2(user_ID).then(user => {
            getUser2(user_ID2).then(user2 => {
                getAllConversations(user.attributes.lms_conversations.data).then(conversations => {
                    const theConver = conversations.filter(convers => {
                        // Verifica que convers y los atributos necesarios no sean null
                        if (convers && convers.data && convers.data.attributes.lms_users && convers.data.attributes.lms_users.data.length >= 2) {
                            const user1 = convers.data.attributes.lms_users.data[0].attributes.user_ID;
                            const user2 = convers.data.attributes.lms_users.data[1].attributes.user_ID;
                    
                            // Verifica si el primer usuario coincide con user_ID y el segundo usuario con user_ID2
                            if ((user1 === user_ID && user2 === user_ID2) || (user2 === user_ID && user1 === user_ID2)) {
                                return true;
                            }
                        }
                        return false;
                    });
                    
                    console.log(theConver);
                    
                    if(theConver.length === 0){
                        createConversation(user.id, user2.id).then(result => {
                            getUser2(user_ID).then(user => {
                                getAllConversations(user.attributes.lms_conversations.data).then(conversations => {
                                    const theConver = conversations.filter(convers => {
                                        // Verifica que convers y los atributos necesarios no sean null
                                        if (convers && convers.data && convers.data.attributes.lms_users && convers.data.attributes.lms_users.data.length >= 2) {
                                            const user1 = convers.data.attributes.lms_users.data[0].attributes.user_ID;
                                            const user2 = convers.data.attributes.lms_users.data[1].attributes.user_ID;
                                    
                                            // Verifica si el primer usuario coincide con user_ID y el segundo usuario con user_ID2
                                            if ((user1 === user_ID && user2 === user_ID2) || (user2 === user_ID && user1 === user_ID2)) {
                                                return true;
                                            }
                                        }
                                        return false;
                                    });
    
                                    res.status(200).send({data: theConver[0], status: true, message: "sucefull"})
                                }).catch(error => {res.status(400).send({error, status: false})})
                            }).catch(error => {res.status(400).send({error, status: false})})
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }else{
                        res.status(200).send({data: theConver[0], status: true, message: "sucefull"})  
                    }
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "missing data", status: false}) 
    }
})

router.get("/get-conversation-messages", (req, res) => {
    const conversation_id = req.query.conversation_id;
    if(conversation_id){
        getConversation2(conversation_id).then(conver => {
            res.status(200).send({data: conver, status: true, message: "sucefull"})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "missing data", status: false}) 
    }
})

router.post("/read-message", (req, res) => {
    const user_ID = req.body.user_ID;
    const message_id = req.body.message_id;
    if(user_ID && message_id){
        getUser2(user_ID).then(user => {
            readMessage(user.id, message_id).then(messsasge => {
                res.status(200).send({data: messsasge, status: true, message: "sucefull"})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "missing data in the body", status: false})
    }
})

module.exports = router;