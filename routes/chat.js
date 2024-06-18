const express = require('express');
const { addMessage, getUser2, createConversation, getAllConversations, getConversation, readMessage, getConversation2, getAllUsers } = require('../apis/apiStrapi');
const { verifyToken, refreshAccessToken } = require('../apis/apiFirebase');
const router = express.Router();

router.post("/add-message", async (req, res) => {
    const user_ID = req.body.from_user_ID;
    const user_ID2 = req.body.to_user_ID2;
    const message = req.body.message;
    const conversation_id = req.body.conversation_id;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];
    if(user_ID && user_ID2 && message && conversation_id){
        try {
            // Verificar el token
            const tokenPayload = verifyToken(token);
    
            // Procede con la lógica normal de agregar mensaje
            const result = await addMessage(user_ID, user_ID2, message, conversation_id);
            const conversation = await getConversation2(conversation_id);
    
            res.status(200).send({ data: conversation, status: true, message: "Successful" });
    
        } catch (error) {
            // Manejo de errores relacionados con el token
            if (error.name === 'TokenExpiredError') {
                // Token expirado, intentar refrescarlo
               
                if (refreshToken) {
                    try {
                        const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                        // Proceder con la lógica normal después de refrescar el token
                        const result = await addMessage(user_ID, user_ID2, message, conversation_id);
                        const conversation = await getConversation2(conversation_id);
    
                        res.status(200).send({ data: conversation,  newAccessToken: newAccessToken, status: true, message: "Token refreshed and message added successfully" });
                    } catch (refreshError) {
                        res.status(401).send({ message: refreshError.message, status: false });
                    }
                } else {
                    res.status(401).send({ message: 'Missing refresh token', status: false });
                }
            }
        }
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

router.get("/get-user-conversations", async (req, res) => {
    const { user_ID } = req.query;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !token) {
        return res.status(401).send({ message: "Missing data in the body", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);
        // Si el token es válido, proceder con la lógica normal
        const user = await getUser2(user_ID);
        const conversations = await getAllConversations(user.attributes.lms_conversations.data);
        res.status(200).send({ data: conversations, status: true, message: "Successful" });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                // Intentar actualizar el token de acceso usando el refresh token
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                // Proceder con la lógica normal después de refrescar el token
                const user = await getUser2(user_ID);
                const conversations = await getAllConversations(user.attributes.lms_conversations.data);
                res.status(200).send({ data: conversations,  newAccessToken: newAccessToken, status: true, message: "Token refreshed and conversations retrieved successfully" });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } else {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }
    }
});


router.get("/get-one-user-conversations", async (req, res) => {
    const { user_ID, user_ID2 } = req.query;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !user_ID2 || !token) {
        return res.status(401).send({ message: "Missing data in the body", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);
        // Si el token es válido, proceder con la lógica normal
        const user = await getUser2(user_ID);
        const user2 = await getUser2(user_ID2);
        const conversations = await getAllConversations(user.attributes.lms_conversations.data);
        
        const theConver = conversations.filter(convers => {
            if (convers && convers.data && convers.data.attributes.lms_users && convers.data.attributes.lms_users.data.length >= 2) {
                const user1 = convers.data.attributes.lms_users.data[0].attributes.user_ID;
                const user2 = convers.data.attributes.lms_users.data[1].attributes.user_ID;
                if ((user1 === user_ID && user2 === user_ID2) || (user2 === user_ID && user1 === user_ID2)) {
                    return true;
                }
            }
            return false;
        });

        if (theConver.length === 0) {
            const result = await createConversation(user.id, user2.id);
            const updatedUser = await getUser2(user_ID);
            const updatedConversations = await getAllConversations(updatedUser.attributes.lms_conversations.data);
            const newConver = updatedConversations.filter(convers => {
                if (convers && convers.data && convers.data.attributes.lms_users && convers.data.attributes.lms_users.data.length >= 2) {
                    const user1 = convers.data.attributes.lms_users.data[0].attributes.user_ID;
                    const user2 = convers.data.attributes.lms_users.data[1].attributes.user_ID;
                    if ((user1 === user_ID && user2 === user_ID2) || (user2 === user_ID && user1 === user_ID2)) {
                        return true;
                    }
                }
                return false;
            });
            res.status(200).send({ data: newConver[0], status: true, message: "Successful" });
        } else {
            res.status(200).send({ data: theConver[0], status: true, message: "Successful" });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                // Intentar actualizar el token de acceso usando el refresh token
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                // Proceder con la lógica normal después de refrescar el token
                const user = await getUser2(user_ID);
                const user2 = await getUser2(user_ID2);
                const conversations = await getAllConversations(user.attributes.lms_conversations.data);

                const theConver = conversations.filter(convers => {
                    if (convers && convers.data && convers.data.attributes.lms_users && convers.data.attributes.lms_users.data.length >= 2) {
                        const user1 = convers.data.attributes.lms_users.data[0].attributes.user_ID;
                        const user2 = convers.data.attributes.lms_users.data[1].attributes.user_ID;
                        if ((user1 === user_ID && user2 === user_ID2) || (user2 === user_ID && user1 === user_ID2)) {
                            return true;
                        }
                    }
                    return false;
                });

                if (theConver.length === 0) {
                    const result = await createConversation(user.id, user2.id);
                    const updatedUser = await getUser2(user_ID);
                    const updatedConversations = await getAllConversations(updatedUser.attributes.lms_conversations.data);
                    const newConver = updatedConversations.filter(convers => {
                        if (convers && convers.data && convers.data.attributes.lms_users && convers.data.attributes.lms_users.data.length >= 2) {
                            const user1 = convers.data.attributes.lms_users.data[0].attributes.user_ID;
                            const user2 = convers.data.attributes.lms_users.data[1].attributes.user_ID;
                            if ((user1 === user_ID && user2 === user_ID2) || (user2 === user_ID && user1 === user_ID2)) {
                                return true;
                            }
                        }
                        return false;
                    });
                    res.status(200).send({ data: newConver[0],  newAccessToken: newAccessToken, status: true, message: "Token refreshed and conversations retrieved successfully" });
                } else {
                    res.status(200).send({ data: theConver[0],  newAccessToken: newAccessToken, status: true, message: "Token refreshed and conversations retrieved successfully" });
                }
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } else {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }
    }
});


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

router.post("/read-message", async (req, res) => {
    const user_ID = req.body.user_ID;
    const message_id = req.body.message_id;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !message_id || !token) {
        return res.status(400).send({ message: "Missing user ID, message ID, or token in the body", status: false });
    }

    try {
        // Verificar el token
        const tokenPayload = verifyToken(token);

        // Procede con la lógica normal de leer el mensaje
        const user = await getUser2(user_ID);
        const message = await readMessage(user.id, message_id);

        res.status(200).send({ data: message, status: true, message: "Successful" });

    } catch (error) {
        // Manejo de errores relacionados con el token
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                // Intentar refrescar el token de acceso usando el refresh token
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);

                // Proceder con la lógica normal después de refrescar el token
                const user = await getUser2(user_ID);
                const message = await readMessage(user.id, message_id);

                res.status(200).send({ data: message,  newAccessToken: newAccessToken, status: true, message: "Token refreshed and message read successfully" });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } else {
            // Otro tipo de error relacionado con el token
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }
    }
});


module.exports = router;